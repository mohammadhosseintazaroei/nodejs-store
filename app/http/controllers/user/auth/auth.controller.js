const createError = require("http-errors");
const { UserModel } = require("../../../../models/user.model");
const { EXPIRES_IN, USER_ROLE, ROLES } = require("../../../../utils/constants");
const {
  GenerateRandomNumber,
  SignAccessToken,
  SignRefreshToken,
} = require("../../../../utils/functions");
const {
  verifyRefreshToken,
} = require("../../../middlewares/verifyAccessToken");
const {
  GetOtpSchema,
  CheckOtpSchema,
} = require("../../../validators/user/auth.schema");
const { StatusCodes: HttpStatus } = require("http-status-codes");

const Controller = require("../../controller");

class UserAuthController extends Controller {
  async GetOtp(req, res, next) {
    try {
      await GetOtpSchema.validateAsync(req.body);
      const { mobile } = req.body;
      let userResult = await UserModel.findOne({ mobile }).select({
        "otp.expiresIn": 1,
      });
      if (userResult) {
        const now = Date.now();
        if (Number( userResult.otp.expiresIn) > now) {
          return res.status(HttpStatus.OK).json({
            status: HttpStatus.OK,
            message: "you have to wait until the verification code expires",
          });
        }
  
      }

      const code = GenerateRandomNumber();
      const result = await this.saveUser(mobile, code);
      if (!result) throw createError.Unauthorized("You were not logged In");
      return res.status(HttpStatus.OK).json({
        status: HttpStatus.OK,
        success: true,
        mobile,
        message: `the verify code has been sent`,
      });
    } catch (error) {
      next(createError.BadRequest(error.message));
    }
  }
  async CheckOtp(req, res, next) {
    try {
      await CheckOtpSchema.validateAsync(req.body);
      const { mobile, code } = req.body;
      const user = await UserModel.findOne({ mobile });
      if (!user) throw createError.NotFound("Your Account was not Found 🔍");
      if (user.otp.code != code)
        throw createError.Unauthorized("Wrong Code! 🐢");
      const now = Date.now();
      if (Number(user.otp.expiresIn) < now)
        throw createError.Unauthorized("Code has been expired 🐢");
      const token = await SignAccessToken(user);
      const refreshToken = await SignRefreshToken(user._id);
      return res.json({
        success: true,
        accessToken: token,
        refreshToken,
      });
    } catch (error) {
      next(error);
    }
  }
  async refreshToken(req, res, next) {
    try {
      const { refreshToken } = req.body;
      const mobile = await verifyRefreshToken(refreshToken);
      const user = await UserModel.findOne({ mobile });
      const AccessToken = await SignAccessToken(user);
      const newRefreshToken = await SignRefreshToken(user._id);
      return res.json({
        status: 200,
        success: true,
        data: {
          accessToken: AccessToken,
          refreshToken: newRefreshToken,
        },
      });
    } catch (error) {
      next(error);
    }
  }
  async CheckUserExistence(mobile) {
    const result = await UserModel.findOne({ mobile });
    return !!result;
  }
  async saveUser(mobile, code) {
    let otp = {
      code,
      expiresIn: new Date().getTime() + 120000,
    };
    const result = await this.CheckUserExistence(mobile);
    if (result) {
      return await this.UpdateUser(mobile, { otp });
    }
    return !!(await UserModel.create({
      mobile,
      otp,
      Role: ROLES.USER,
    }));
  }
  async UpdateUser(mobile, updateBody = {}) {
    Object.keys(updateBody).forEach((key) => {
      if (
        ["", " ", "  ", ".", 0, -1, NaN, null, undefined, false, "0"].includes(
          key
        )
      )
        delete updateBody[key];
    });
    const updateResult = await UserModel.updateOne(
      { mobile },
      { $set: updateBody }
    );
    return !!updateResult.modifiedCount;
  }
}

module.exports = {
  UserAuthController: new UserAuthController(),
};

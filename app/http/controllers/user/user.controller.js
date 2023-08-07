const createHttpError = require("http-errors");
const { StatusCodes: HttpStatus } = require("http-status-codes");

const { UserModel } = require("../../../models/user.model");
const { DeleteInvalidPropertyInObject } = require("../../../utils/functions");
const Controller = require("../controller");
const path = require("path");
const { CreateUserSchema } = require("../../validators/admin/user.schema");
const { UserAuthController } = require("./auth/auth.controller");
const { default: mongoose } = require("mongoose");

class UserController extends Controller {
  async CreateUser(req, res, next) {
    try {
      const { first_name, last_name, mobile, email, username } =
        await CreateUserSchema.validateAsync(req.body);
      if (req?.body?.fileUploadPath && req?.body?.fileName) {
        req.body.avatar = path
          .join(req?.body?.fileUploadPath, req.body.fileName)
          .replace(/\\/gi, "/");
      }
      const avatar = req.body.avatar;
      const result = await UserAuthController.CheckUserExistence(mobile);
      if (result)
        throw createHttpError.NotFound(
          "شماره تلفن وارد شده در سیستم موجود میباشد "
        );

      const CreateResult = await UserModel.create({
        first_name,
        last_name,
        mobile,
        email,
        username,
        avatar,
      });
      if (!CreateResult)
        throw createHttpError.InternalServerError("User was not created");
      return res.status(HttpStatus.CREATED).json({
        statusCode: HttpStatus.CREATED,
        success: true,
        data: {
          d: req.body,
          message: "User was created successfully ✨🎉",
        },
      });
    } catch (error) {
      next(error);
    }
  }
  async GetAllUsers(req, res, next) {
    try {
      const { search } = req.query;
      const databaseQuery = {};
      let Users;
      if (search) {
        databaseQuery["$text"] = { $search: search };
        Users = await UserModel.find(databaseQuery);
        if (!Users || Users.length == 0) {
          throw createHttpError.NotFound("No Users were found! ");
        }
      }
      Users = await UserModel.find({});
      if (!Users) throw createHttpError.NotFound("No Users were found! ");
      return res.status(HttpStatus.OK).json({
        status: HttpStatus.OK,
        success: true,
        data: {
          Users,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async GetUserById(req, res, next) {
    try {
      const { id } = req.params;
      const user = await this.FindUser(id)
      return res.status(HttpStatus.OK).json({
        status: HttpStatus.OK,
        success: true,
        data: {
          user,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async UpdateUserProfile(req, res, next) {
    try {
      const userID = req.user._id;
      if (req?.body?.fileUploadPath && req?.body.fileName) {
        req.body.avatar = path
          .join(req?.body?.fileUploadPath, req.body.fileName)
          .replace(/\\/gi, "/");
      }
      const data = req.body;
      const BlackList = [
        "mobile",
        "otp",
        "bills",
        "discount",
        "Role",
        "Courses",
      ];
      DeleteInvalidPropertyInObject(data, BlackList);
      const UpdateResult = await UserModel.updateOne(
        { _id: userID },
        { $set: data }
      );
      if (UpdateResult.modifiedCount == 0)
        throw createHttpError.InternalServerError("Update was not done! ");
      return res.status(HttpStatus.OK).json({
        status: HttpStatus.OK,
        success: true,
        data: {
          message: "User was updated successfully! 🎉✨🔥",
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async UpdateUser(req, res, next) {
    try {
      const { id } = req.params;
      await this.FindUser(id);
      if (req?.body?.fileUploadPath && req?.body.fileName) {
        req.body.avatar = path
          .join(req?.body?.fileUploadPath, req.body.fileName)
          .replace(/\\/gi, "/");
      }
      const data = req.body;
      const BlackList = [
        "mobile",
        "otp",
        "bills",
        "discount",
        "Role",
        "Courses",
      ];
      DeleteInvalidPropertyInObject(data, BlackList);
      const UpdateResult = await UserModel.updateOne(
        { _id: id },
        { $set: data }
      );
      if (UpdateResult.modifiedCount == 0)
        throw createHttpError.InternalServerError("Update was not done! ");
      return res.status(HttpStatus.OK).json({
        status: HttpStatus.OK,
        success: true,
        data: {
          message: "User was updated successfully! 🎉✨🔥",
        },
      });
    } catch (error) {
      next(error);
    }
  }
  async RemoveUser(req, res, next) {
    try {
      const { id } = req.params;
      console.log(id);
      if (!mongoose.isValidObjectId(id))
        throw createHttpError.BadRequest("userId is not correct");
      console.log("Removing user");
      const deleteResult = await UserModel.deleteOne({ _id: id });
      if (deleteResult.deletedCount == 0)
        throw createHttpError.InternalServerError(
          "User was not deleted! Please try again"
        );
      return res.status(HttpStatus.OK).json({
        status: HttpStatus.OK,
        success: true,
        data: {
          message: "Successfully deleted 🎉✨ ",
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async UserProfile(req, res, next) {
    try {
      const user = req.user;
      return res.status(HttpStatus.OK).json({
        status: HttpStatus.OK,
        success: true,
        data: {
          user,
        },
      });
    } catch (error) {
      next(error);
    }
  }
  async FindUser(id) {
    if (!mongoose.isValidObjectId(id))
      throw createHttpError.BadRequest("userId is not corrrect");
    const user = await UserModel.findOne({ _id: id });
    if (!user)
      throw createHttpError.NotFound("There is no such a Mag Here! 🐢🗿");
    return user;
  }
}

module.exports = {
  UserController: new UserController(),
};

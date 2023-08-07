const JWT = require("jsonwebtoken");
const {
  REFRESH_TOKEN_SECRET_KEY,
  ACCESS_TOKEN_SECRET_KEY,
} = require("../../utils/constants");
const { UserModel } = require("../../models/user.model");
const redisClient = require("../../utils/initRedis");
const { json } = require("express");
const createHttpError = require("http-errors");

async function GetToken(headers) {
  const [bearer, token] = headers?.authorization?.split(" ") || [];
  if (token && ["Bearer", "bearer"].includes(bearer)) return token.trim();
  throw createHttpError.Unauthorized("please Login first! 🐢");
}

async function verifyAccessToken(req, res, next) {
  try {
    const token = await GetToken(req.headers).then((token) => token);
    JWT.verify(token, ACCESS_TOKEN_SECRET_KEY, async (err, payload) => {
      try {
        if (err)
          throw createHttpError.Unauthorized("Login to your account! 🐢");
        const { mobile } = payload || {};
        console.log(mobile)
        const user = await UserModel.findOne(
          { mobile },
          { password: 0, otp: 0 }
        );
        if (!user)
          throw createHttpError.Unauthorized("Account was not found! 🐢");
        req.user = user;
        return next();
      } catch (error) {
        next(error);
      }
    });
  } catch (error) {
    next(error);
  }
}

const verifyRefreshToken = (token) => {
  return new Promise((resolve, reject) => {
    JWT.verify(token, REFRESH_TOKEN_SECRET_KEY, async (err, payload) => {
      if (err)
      console.log(err);
        reject(
          createHttpError.Unauthorized("Please Log in to your account! 🐢")
        );

      const { mobile } = payload || {};

      const user = await UserModel.findOne({ mobile }, { password: 0, otp: 0 });

      if (!user)
        reject(createHttpError.Unauthorized("No Account Was found! 🐢"));
console.log(user)
      const refreshToken = await redisClient.get(String(user._id));
      if (token === refreshToken) resolve(mobile);

      reject(
        createHttpError.Unauthorized("Force Login to account was not done")
      );
    });
  });
};

// ____________ My Way For Handel VerifyAccessTokenInGraphQL ____________ //
// async function VerifyAccessTokenInGraphQL(req) {
//   try {
//     let userDecodedInfo;
//     const token = await GetToken(req.headers);
//     const userProperties = await JWT.verify(
//       token,
//       ACCESS_TOKEN_SECRET_KEY,
//       function (err, decoded) {
//         userDecodedInfo = decoded
//         if (err)
//           throw createHttpError.Unauthorized("the token sent is not valid");
//       }
//     );
//     const user = await UserModel.findOne({ mobile: userDecodedInfo.mobile }, { password: 0, otp: 0 });
//     if (!user) throw createHttpError.Unauthorized("user account not found");
//     return user;
//   } catch (error) {

//     throw createHttpError.Unauthorized(error.message);
//   }
// }

async function VerifyAccessTokenInGraphQL(req) {
  try {
    const token = await GetToken(req.headers);
    const { mobile } = JWT.verify(token, ACCESS_TOKEN_SECRET_KEY);
    const user = await UserModel.findOne({ mobile }, { password: 0, otp: 0 });
    if (!user) throw new createHttpError.Unauthorized("user account not found");
    return user;
  } catch (error) {
    throw new createHttpError.Unauthorized();
  }
}
module.exports = {
  verifyAccessToken,
  verifyRefreshToken,
  VerifyAccessTokenInGraphQL,
};

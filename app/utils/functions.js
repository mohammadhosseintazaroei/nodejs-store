const path = require("path");
const fs = require("fs");
const JWT = require("jsonwebtoken");
const { UserModel } = require("../models/user.model");
const {
  REFRESH_TOKEN_SECRET_KEY,
  ACCESS_TOKEN_SECRET_KEY,
} = require("./constants");
const createError = require("http-errors");
const redisClient = require("./init_redis");

function GenerateRandomNumber() {
  return Math.floor(Math.random() * 90000) + 10000;
}

async function SignAccessToken(user) {
  const { mobile } = user;

  const options = {
    expiresIn: "30d",
  };

  return JWT.sign({ mobile }, ACCESS_TOKEN_SECRET_KEY, options);
}

async function SignRefreshToken(userId) {
  return new Promise(async (resolve, reject) => {
    const user = await UserModel.findById(userId);
    const mobile = user.mobile;

    const options = {
      expiresIn: "1y",
    };

    JWT.sign(
      { mobile },
      REFRESH_TOKEN_SECRET_KEY,
      options,
      async (err, token) => {
        if (err)
          reject(createError.InternalServerError("Internal Server Error"));
        await redisClient.set(
          String(userId),
          token,
          { EX: 31536000 },
          (err) => {
            if (err) reject(console.log(err));
          }
        );
        resolve(token);
      }
    );
  });
}

function ListOfImagesFromRequest(files, fileUploadPath) {
  if (files?.length > 0) {
    return files
      .map((file) => path.join(fileUploadPath, file.filename))
      .map((item) => item.replace(/\\/gi, "/"));
  } else {
    return [];
  }
}

function getTime(seconds) {
  let total = Math.round(seconds) / 60;
  let [minutes, percent] = String(total).split(".");
  let second = Math.round((percent * 60) / 100)
    .toString()
    .substring(0, 2);
  let houre = 0;
  if (minutes > 60) {
    total = minutes / 60;
    let [h1, percent] = String(total).split(".");
    (houre = h1),
      (minutes = Math.round((percent * 60) / 100)
        .toString()
        .substring(0, 2));
  }
  return houre + ":" + minutes + ":" + second;
}

function DeleteFileInPublic(FileAddress) {
  if (FileAddress) {
    const FilePath = path.join(__dirname, "..", "..", "public", FileAddress);
    if (fs.existsSync(FilePath)) fs.unlinkSync(FilePath);
  }
}

function CopyObject(object) {
  return JSON.parse(JSON.stringify(object));
}

function SetFeatures(body) {
  const { colors, width, height, length, weight } = body;
  let features = {};
  if (!isNaN(+width) || !isNaN(+height) || !isNaN(+length) || !isNaN(+weight)) {
    features.colors = colors;
    if (!width) features.width = 0;
    else features.width = +width;
    if (!height) features.height = 0;
    else features.height = +height;
    if (!length) features.length = 0;
    else features.length = +length;
    if (!weight) features.weight = 0;
    else features.weight = +weight;
  }
  return features;
}

function DeleteInvalidPropertyInObject(data = {}, blackListFields = []) {
  let nullishData = ["", " ", "0", 0, null, undefined];
  Object.keys(data).forEach((key) => {
    if (blackListFields.includes(key)) delete data[key];
    if (typeof data[key] == "string") data[key] = data[key].trim();
    if (Array.isArray(data[key]) && data[key].length > 0)
      data[key] = data[key].map((item) => item.trim());
    if (Array.isArray(data[key]) && data[key].length == 0) delete data[key];
    if (nullishData.includes(data[key])) delete data[key];
  });
}

function GetVideosTotalTime(chapters = []) {
  let time,
    hour,
    minute,
    second = 0;
  for (const chapter of chapters) {
    if (Array.isArray(chapter?.episodes)) {
      for (const episode of chapter.episodes) {
        if (episode?.time) time = episode.time.split(":"); // [Hour, Min, sec]
        else time = "00:00:00".split(":");
        if (time.length == 3) {
          second += Number(time[0]) * 3600; // Convert an hour to seconds
          second += Number(time[1]) * 60; // Convert a minute to seconds
          second += Number(time[2]);
        } else if (time.length == 2) {
          second += Number(time[0]) * 60;
          second += Number(time[1]);
        }
      }
    }
  }
  hour = Math.floor(second / 3600);
  minute = Math.floor(second / 60) % 60;
  second = Math.floor(second % 60);
  if (String(hour).length == 1) hour = `0${hour}`;
  if (String(minute).length == 1) minute = `0${minute}`;
  if (String(hour).length == 1) second = `0${second}`;
  return `${hour}:${minute}:${second}`;
}

async function getBasketOfUser(userID) {
  const userDetail = await UserModel.aggregate([
    {
      $match: { _id: userID },
    },
    {
      $project: { basket: 1 },
    },
    {
      $lookup: {
        from: "products",
        localField: "basket.products.productID",
        foreignField: "_id",
        as: "productDetail",
      },
    },
    {
      $lookup: {
        from: "courses",
        localField: "basket.courses.courseID",
        foreignField: "_id",
        as: "courseDetail",
      },
    },
    {
      $addFields: {
        productDetail: {
          $function: {
            body: function (productDetail, products) {
              return productDetail.map(function (product) {
                const count = products.find(
                  (item) => item.productID.valueOf() == product._id.valueOf()
                ).count;
                const totalPrice = count * product.price;
                return {
                  ...product,
                  basketCount: count,
                  totalPrice,
                  finalPrice:
                    totalPrice - (product.discount / 100) * totalPrice,
                };
              });
            },
            args: ["$productDetail", "$basket.products"],
            lang: "js",
          },
        },
        courseDetail: {
          $function: {
            body: function (courseDetail) {
              return courseDetail.map(function (course) {
                return {
                  ...course,
                  finalPrice:
                    course.price - (course.discount / 100) * course.price,
                };
              });
            },
            args: ["$courseDetail"],
            lang: "js",
          },
        },
        payDetail: {
          $function: {
            body: function (courseDetail, productDetail, products) {
              const courseAmount = courseDetail.reduce(function (
                total,
                course
              ) {
                return (
                  total +
                  (course.price - (course.discount / 100) * course.price)
                );
              },
              0);
              const productAmount = productDetail.reduce(function (
                total,
                product
              ) {
                const count = products.find(
                  (item) => item.productID.valueOf() == product._id.valueOf()
                ).count;
                const totalPrice = count * product.price;
                return (
                  total + (totalPrice - (product.discount / 100) * totalPrice)
                );
              },
              0);
              const courseIds = courseDetail.map((course) =>
                course._id.valueOf()
              );
              const productIds = productDetail.map((product) =>
                product._id.valueOf()
              );

              return {
                courseAmount,
                productAmount,
                paymentAmnount: courseAmount + productAmount,
                courseIds,
                productIds,
              };
            },
            args: ["$courseDetail", "$productDetail", "$basket.products"],
            lang: "js",
          },
        },
      },
    },
  ]);
  return CopyObject(userDetail);
}

module.exports = {
  GenerateRandomNumber,
  SignAccessToken,
  SignRefreshToken,
  DeleteFileInPublic,
  ListOfImagesFromRequest,
  CopyObject,
  SetFeatures,
  DeleteInvalidPropertyInObject,
  getTime,
  GetVideosTotalTime,
  getBasketOfUser
};

const { GraphQLString, GraphQLInt } = require("graphql");
const createHttpError = require("http-errors");
const {
  VerifyAccessTokenInGraphQL,
} = require("../../http/middlewares/verifyAccessToken");
const { CourseModel } = require("../../models/course.model");
const { ProductModel } = require("../../models/product.model");
const { UserModel } = require("../../models/user.model");
const { CopyObject } = require("../../utils/functions");
const { ResponseType } = require("../typeDefs/public.type");

const { checkExistProduct, checkExistCourse } = require("../utils");

const AddProductToBasket = {
  type: ResponseType,
  args: {
    productID: { type: GraphQLString },
  },
  resolve: async (_, args, context) => {
    const { req } = context;
    const user = await VerifyAccessTokenInGraphQL(req);
    const { productID } = args;
    await checkExistProduct(productID);
    const product = await findProductInBasket(user._id, productID);

    if (product) {
      await UserModel.updateOne(
        {
          _id: user._id,
          "basket.products.productID": productID,
        },
        {
          $inc: {
            "basket.products.$.count": 1,
          },
        }
      );
    } else {
      await UserModel.updateOne(
        {
          _id: user._id,
        },
        {
          $push: {
            "basket.products": {
              productID,
              count: 1,
            },
          },
        }
      );
    }
    return {
      statusCode: 200,
      data: {
        message: "the product was added to basket",
      },
    };
  },
};

const AddCourseToBasket = {
  type: ResponseType,
  args: {
    courseID: { type: GraphQLString },
  },
  resolve: async (_, args, context) => {
    const { req } = context;
    const user = await VerifyAccessTokenInGraphQL(req);
    const { courseID } = args;
    await checkExistCourse(courseID);
    const userCourse = await UserModel.findOne({
      _id: user._id,
      Courses: courseID,
    });
    if (userCourse)
      throw new createHttpError.BadRequest(
        "شما این دوره رو قبلا خریداری کردید"
      );
    const course = await findCourseInBasket(user._id, courseID);

    if (course) {
      throw createHttpError.BadRequest("این دوره قبلا به سبد خرید اضافه شده");
    } else {
      await UserModel.updateOne(
        {
          _id: user._id,
        },
        {
          $push: {
            "basket.courses": {
              courseID,
              count: 1,
            },
          },
        }
      );
    }
    return {
      statusCode: 200,
      data: {
        message: "the course was added to basket",
      },
    };
  },
};

const RemoveProductFromBasket = {
  type: ResponseType,
  args: {
    productID: { type: GraphQLString },
  },
  resolve: async (_, args, context) => {
    const { req } = context;
    const user = await VerifyAccessTokenInGraphQL(req);
    const { productID } = args;
    await checkExistProduct(productID);
    const product = await findProductInBasket(user._id, productID);
    let message;
    if (!product)
      throw createHttpError.NotFound("your desired product was not found");
    if (product.count > 1) {
      await UserModel.updateOne(
        {
          _id: user._id,
          "basket.products.productID": productID,
        },
        {
          $inc: {
            "basket.products.$.count": -1,
          },
        }
      );
      message = "the product was decreased from the sopping card";
    } else {
      await UserModel.updateOne(
        {
          _id: user._id,
          "basket.products.productID": productID,
        },
        {
          $pull: {
            "basket.products": {
              productID,
            },
          },
        }
      );
      message = "the product was removed from the sopping card";
    }
    return {
      statusCode: 200,
      data: {
        message,
      },
    };
  },
};

const RemoveCourseFromBasket = {
  type: ResponseType,
  args: {
    courseID: { type: GraphQLString },
  },
  resolve: async (_, args, context) => {
    const { req } = context;
    const user = await VerifyAccessTokenInGraphQL(req);
    const { courseID } = args;
    await checkExistCourse(courseID);
    const course = await findCourseInBasket(user._id, courseID);
    if (!course)
      throw createHttpError.NotFound("your desired course was not found");

    if (course.count > 1) {
      await UserModel.updateOne(
        {
          _id: user._id,
          "basket.courses.courseID": courseID,
        },
        {
          $inc: {
            "basket.courses.$.count": -1,
          },
        }
      );
      message = "the course was decreased from the sopping card";
    } else {
      await UserModel.updateOne(
        {
          _id: user._id,
          "basket.courses.courseID": courseID,
        },
        {
          $pull: {
            "basket.courses": {
              courseID,
            },
          },
        }
      );
      message = "the course was removed from the sopping card";
    }
    return {
      statusCode: 200,
      data: {
        message,
      },
    };
  },
};

async function findProductInBasket(userID, productID) {
  const findResult = await UserModel.findOne(
    { _id: userID, "basket.products.productID": productID },
    { "basket.products.$": 1 }
  );
  const userDetail = CopyObject(findResult);
  return userDetail?.basket?.products?.[0];
}

async function findCourseInBasket(userID, courseID) {
  const findResult = await UserModel.findOne(
    { _id: userID, "basket.courses.courseID": courseID },
    { "basket.courses.$": 1 }
  );
  const userDetail = CopyObject(findResult);
  return userDetail?.basket?.courses?.[0];
}

module.exports = {
  AddProductToBasket,
  AddCourseToBasket,
  RemoveProductFromBasket,
  RemoveCourseFromBasket,
};

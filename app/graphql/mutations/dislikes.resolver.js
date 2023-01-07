const { GraphQLString } = require("graphql");
const {
  VerifyAccessTokenInGraphQL,
} = require("../../http/middlewares/verifyAccessToken");
const { BlogModel } = require("../../models/blog.model");
const { CourseModel } = require("../../models/course.model");
const { ProductModel } = require("../../models/product.model");
const { ResponseType } = require("../typeDefs/public.type");
const {
  checkExistProduct,
  checkExistCourse,
  checkExistBlog,
} = require("../utils");

const DisLikeProduct = {
  type: ResponseType,
  args: {
    productID: { type: GraphQLString },
  },
  resolve: async (_, args, context) => {
    const { req } = context;
    const user = await VerifyAccessTokenInGraphQL(req);
    const { productID } = args;
    await checkExistProduct(productID);
    let likedProduct = await ProductModel.findOne({
      _id: productID,
      likes: user._id,
    });

    let disLikedProduct = await ProductModel.findOne({
      _id: productID,
      dislikes: user._id,
    });
    const updatedQuery = disLikedProduct
      ? { $pull: { dislikes: user._id } }
      : { $push: { dislikes: user._id } };

    await ProductModel.updateOne({ _id: productID }, updatedQuery);
    let message;

    if (!disLikedProduct) {
      if (likedProduct)
        await ProductModel.updateOne(
          { _id: productID },
          { $pull: { likes: user._id } }
        );
      message = "the product has been disliked succesfuly";
    } else message = "the product has been undisliked succesfuly";
    return {
      statusCode: 201,
      data: {
        message,
      },
    };
  },
};
const DisLikeCourse = {
  type: ResponseType,
  args: {
    courseID: { type: GraphQLString },
  },
  resolve: async (_, args, context) => {
    const { req } = context;
    const user = await VerifyAccessTokenInGraphQL(req);
    const { courseID } = args;
    await checkExistCourse(courseID);
    let likedCourse = await CourseModel.findOne({
      _id: courseID,
      likes: user._id,
    });

    let disLikedCourse = await CourseModel.findOne({
      _id: courseID,
      dislikes: user._id,
    });
    const updatedQuery = disLikedCourse
      ? { $pull: { dislikes: user._id } }
      : { $push: { dislikes: user._id } };

    await CourseModel.updateOne({ _id: courseID }, updatedQuery);
    let message;

    if (!disLikedCourse) {
      if (likedCourse)
        await CourseModel.updateOne(
          { _id: courseID },
          { $pull: { likes: user._id } }
        );
      message = "the course has been disliked succesfuly";
    } else message = "the course has been undisliked succesfuly";
    return {
      statusCode: 201,
      data: {
        message,
      },
    };
  },
};
const DisLikeBlog = {
  type: ResponseType,
  args: {
    blogID: { type: GraphQLString },
  },
  resolve: async (_, args, context) => {
    const { req } = context;
    const user = await VerifyAccessTokenInGraphQL(req);
    const { blogID } = args;
    await checkExistBlog(blogID);
    let likedBlog = await BlogModel.findOne({
      _id: blogID,
      likes: user._id,
    });

    let disLikedBlog = await BlogModel.findOne({
      _id: blogID,
      dislikes: user._id,
    });
    const updatedQuery = disLikedBlog
      ? { $pull: { dislikes: user._id } }
      : { $push: { dislikes: user._id } };

    await BlogModel.updateOne({ _id: blogID }, updatedQuery);
    let message;

    if (!disLikedBlog) {
      if (likedBlog)
        await BlogModel.updateOne(
          { _id: blogID },
          { $pull: { likes: user._id } }
        );
      message = "the blog has been disliked succesfuly";
    } else message = "the blog has been undisliked succesfuly";
    return {
      statusCode: 201,
      data: {
        message,
      },
    };
  },
};

module.exports = {
  DisLikeProduct,
  DisLikeCourse,
  DisLikeBlog,
};

const { GraphQLString } = require("graphql");
const { StatusCodes: HttpStatus } = require("http-status-codes");

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

const LikeProduct = {
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
    const updatedQuery = likedProduct
      ? { $pull: { likes: user._id } }
      : { $push: { likes: user._id } };
    await ProductModel.updateOne({ _id: productID }, updatedQuery);
    let message;

    if (!likedProduct) {
      await ProductModel.updateOne(
        { _id: productID },
        { $pull: { dislikes: user._id } }
      );
      message = "the product has been liked succesfuly";
    } else message = "the product has been unliked succesfuly";
    return {
      statusCode: HttpStatus.OK,
      data: {
        message,
      },
    };
  },
};

const LikeCourse = {
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
    const updatedQuery = likedCourse
      ? { $pull: { likes: user._id } }
      : { $push: { likes: user._id } };
    await CourseModel.updateOne({ _id: courseID }, updatedQuery);
    let message;
    if (!likedCourse) {
      if (disLikedCourse)
        await CourseModel.updateOne(
          { _id: courseID },
          { $pull: { dislikes: user._id } }
        );
      message = "the course has been liked succesfuly";
    } else message = "the course has been unliked succesfuly";
    return {
      statusCode: HttpStatus.OK,
      data: {
        message,
      },
    };
  },
};

const LikeBlog = {
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
    const updatedQuery = likedBlog
      ? { $pull: { likes: user._id } }
      : { $push: { likes: user._id } };
    await BlogModel.updateOne({ _id: blogID }, updatedQuery);
    let message;
    if (!likedBlog) {
      if (disLikedBlog)
        await BlogModel.updateOne(
          { _id: blogID },
          { $pull: { dislikes: user._id } }
        );
      message = "the blog has been liked succesfuly";
    } else message = "the blog has been unliked succesfuly";
    return {
      statusCode: HttpStatus.OK,
      data: {
        message,
      },
    };
  },
};

module.exports = {
  LikeProduct,
  LikeCourse,
  LikeBlog,
};

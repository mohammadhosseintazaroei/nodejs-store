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

const BookmarkProduct = {
  type: ResponseType,
  args: {
    productID: { type: GraphQLString },
  },
  resolve: async (_, args, context) => {
    const { req } = context;
    const user = await VerifyAccessTokenInGraphQL(req);
    const { productID } = args;
    await checkExistProduct(productID);
    let bookmarkedProduct = await ProductModel.findOne({
      _id: productID,
      bookmarks: user._id,
    });
    const updatedQuery = bookmarkedProduct
      ? { $pull: { bookmarks: user._id } }
      : { $push: { bookmarks: user._id } };
    await ProductModel.updateOne({ _id: productID }, updatedQuery);
    let message;

    if (!bookmarkedProduct) {

      message = "the product has been bookmarked succesfuly";
    } else message = "the product has been unbookmarked succesfuly";
    return {
      statusCode: HttpStatus.OK,
      data: {
        message,
      },
    };
  },
};

const BookmarkCourse = {
  type: ResponseType,
  args: {
    courseID: { type: GraphQLString },
  },
  resolve: async (_, args, context) => {
    const { req } = context;
    const user = await VerifyAccessTokenInGraphQL(req);
    const { courseID } = args;
    await checkExistCourse(courseID);
    let bookmarkedCourse = await CourseModel.findOne({
      _id: courseID,
      bookmarks: user._id,
    });


    const updatedQuery = bookmarkedCourse
      ? { $pull: { bookmarks: user._id } }
      : { $push: { bookmarks: user._id } };
    await CourseModel.updateOne({ _id: courseID }, updatedQuery);
    let message;
    if (!bookmarkedCourse) {
      message = "the course has been bookmarked succesfuly";
    } else message = "the course has been unbookmarked succesfuly";
    return {
      statusCode: HttpStatus.OK,
      data: {
        message,
      },
    };
  },
};

const BookmarkBlog = {
  type: ResponseType,
  args: {
    blogID: { type: GraphQLString },
  },
  resolve: async (_, args, context) => {
    const { req } = context;
    const user = await VerifyAccessTokenInGraphQL(req);
    const { blogID } = args;
    await checkExistBlog(blogID);
    let bookmarkedBlog = await BlogModel.findOne({
      _id: blogID,
      bookmarks: user._id,
    });

    const updatedQuery = bookmarkedBlog
      ? { $pull: { bookmarks: user._id } }
      : { $push: { bookmarks: user._id } };
    await BlogModel.updateOne({ _id: blogID }, updatedQuery);
    let message;
    if (!bookmarkedBlog) {
      message = "the blog has been bookmarked succesfuly";
    } else message = "the blog has been unbookmarked succesfuly";
    return {
      statusCode: HttpStatus.OK,
      data: {
        message,
      },
    };
  },
};

module.exports = {
  BookmarkProduct,
  BookmarkCourse,
  BookmarkBlog,
};

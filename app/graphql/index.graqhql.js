const { GraphQLObjectType, GraphQLSchema } = require("graphql");
const { BlogResolver } = require("./queries/blog.resolver");
const {
  CategoriesResolver,
  CategoryChildResolver,
} = require("./queries/category.resolver");
const {
  getUserBookmarkedBlogs,
  getUserBookmarkedCourses,
  getUserBookmarkedProducts
} = require("./queries/user-profile.resolver");
const {
  CreateCommentForBlog,
  CreateCommentForCourse,
  CreateCommentForProduct,
} = require("./mutations/comment.resolver");
const {
  LikeProduct,
  LikeCourse,
  LikeBlog
} = require("./mutations/likes.resolver");
const {
  DisLikeProduct,
  DisLikeCourse,
  DisLikeBlog
} = require("./mutations/dislikes.resolver");
const {
  BookmarkProduct,
  BookmarkCourse,
  BookmarkBlog
} = require("./mutations/bookmarks.resolver");


const {
  AddProductToBasket,
  AddCourseToBasket,
  RemoveProductFromBasket,
  RemoveCourseFromBasket,
} = require("./mutations/basket.resolver");


const { CourseResolver } = require("./queries/course.resolver");
const { ProductResolver } = require("./queries/product.resolver");
const { BlogType } = require("./typeDefs/blog.type");
// query, mutation, schema, types
const RootQuery = new GraphQLObjectType({
  name: "RootQuery",
  fields: {
    blogs: BlogResolver,
    products: ProductResolver,
    categories: CategoriesResolver,
    childOfCategory: CategoryChildResolver,
    courses: CourseResolver,
    getUserBookmarkedBlogs,
    getUserBookmarkedCourses,
    getUserBookmarkedProducts
  },
});
const RootMutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    CreateCommentForBlog,
    CreateCommentForCourse,
    CreateCommentForProduct,
    LikeProduct,
    LikeCourse,
    LikeBlog,
    DisLikeProduct,
    DisLikeCourse,
    DisLikeBlog,
    BookmarkProduct,
    BookmarkCourse,
    BookmarkBlog,
    AddProductToBasket,
    AddCourseToBasket,
    RemoveProductFromBasket,
    RemoveCourseFromBasket,
  },
});

const graphQLSchema = new GraphQLSchema({
  query: RootQuery,
  mutation: RootMutation,
});

module.exports = {
  graphQLSchema,
};

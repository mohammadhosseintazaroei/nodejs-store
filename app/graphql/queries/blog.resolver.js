const { GraphQLList } = require("graphql");
const { BlogModel } = require("../../models/blog.model");
const { BlogType } = require("../typeDefs/blog.type");

const BlogResolver = {
  type: new GraphQLList(BlogType),
  resolve: async (_,args) => {
    console.log(await BlogModel.find({}).populate([
      { path: "author" },
      { path: "category"}
    ]))
    return await BlogModel.find({}).populate([
      { path: "author" },
      { path: "category" }
    ]);
  },
};

module.exports = {
  BlogResolver,
};

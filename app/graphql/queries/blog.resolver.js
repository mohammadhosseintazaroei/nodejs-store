const { GraphQLList, GraphQLString } = require("graphql");
const { BlogModel } = require("../../models/blog.model");
const { BlogType } = require("../typeDefs/blog.type");

const BlogResolver = {
  type: new GraphQLList(BlogType),
  args: {
    category: {type: GraphQLString}
  },
  resolve: async (_,args) => {
    const {category} = args
    const findQuery = category? {category} : {}
    console.log( await BlogModel.find(findQuery).populate([
      { path: "author" },
      { path: "category" }
    ]))
    return await BlogModel.find(findQuery).populate([
      { path: "author" },
      { path: "category" },
      { path: "comments.user" },
      { path: "comments.answers.user" },

    ]);
  },
};

module.exports = {
  BlogResolver,
};

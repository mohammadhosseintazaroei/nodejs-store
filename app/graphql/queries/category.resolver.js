const { GraphQLList, GraphQLString } = require("graphql");
const { CategoryModel } = require("../../models/categories.model");
const { categoryType } = require("../typeDefs/category.type");

const CategoriesResolver = {
  type: new GraphQLList(categoryType),
  resolve: async () => {
    const categories = await CategoryModel.find({ parent: undefined });
    return categories;
  },
};

const CategoryChildResolver = {
    type: new GraphQLList(categoryType),
    args: {
      parent: { type: GraphQLString },
    },
    resolve: async (_, args) => {
      console.log(args)
      const {parent } = args
      const categories = await CategoryModel.find({ parent });
      return categories
      return categories;
    },
  };

module.exports = {
  CategoriesResolver,
  CategoryChildResolver
};

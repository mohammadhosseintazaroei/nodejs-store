const { GraphQLList } = require("graphql");
const { CategoryModel } = require("../../models/categories.model");
const { categoryType } = require("../typeDefs/category.type");

const CategoriesResolver = {
    type: new GraphQLList(categoryType),
    resolve: async() => {
        const categories = await CategoryModel.find({parent: undefined})
        return categories
    }
}

module.exports = {
CategoriesResolver
}
const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLList,
  GraphQLInt,
} = require("graphql");
const { AuthorType, PublicCategoryType } = require("./public.type");
const EpisodeType = new GraphQLObjectType({
  name: "EpisodeType",
  fields: {
    _id: { type: GraphQLString },
    title: { type: GraphQLString },
    text: { type: GraphQLString },
    type: { type: GraphQLString },
    time: { type: GraphQLString },
    videoAddress: { type: GraphQLString },
    videoURL: { type: GraphQLString },
  },
});
const ChaptersType = new GraphQLObjectType({
  name: "ChaptersType",
  fields: {
    _id: { type: GraphQLString },
    title: { type: GraphQLString },
    text: { type: GraphQLString },
    episodes: { type: GraphQLList(EpisodeType) },
  },
});
const CourseType = new GraphQLObjectType({
  name: "CourseType",
  fields: {
    _id: { type: GraphQLString },
    title: { type: GraphQLString },
    short_text: { type: GraphQLString },
    text: { type: GraphQLString },
    image: { type: GraphQLString },
    imageURL: { type:  GraphQLString },
    tags: { type: new GraphQLList(GraphQLString) },
    category: { type: PublicCategoryType },
    price: { type: GraphQLInt },
    discount: { type: GraphQLInt },
    count: { type: GraphQLInt },
    type: { type: GraphQLString },
    status: { type: GraphQLString },
    teacher: { type: AuthorType },

    chapters: { type: new GraphQLList(ChaptersType) },
  },
});

module.exports = {
  CourseType,
};

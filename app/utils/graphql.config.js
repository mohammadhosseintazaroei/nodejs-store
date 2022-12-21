const {  graphQLSchema } = require("../graphql/index.graqhql");

function GQLConfig(req, res) {
    return {
        schema: graphQLSchema,
        graphiql: true,
        context: { req, res }
    }
}

module.exports = {
    GQLConfig
}

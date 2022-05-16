const {ApolloServer} = require('apollo-server')
const typeDefs = require('./graphql/schema')
const resolvers = require('./graphql/resolvers');
const models = require('./models')


const server = new ApolloServer({
    typeDefs,
    resolvers,
    context : {models}
});




server.listen().then(({url}) => console.log("server running on port : 4000"));
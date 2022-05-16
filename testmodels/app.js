const express = require('express');
const  {ApolloServer}  = require('apollo-server')
const typeDefs = require('./graphql/typeDefs')
const resolvers = require('./graphql/resolvers')
const models = require('./models')
const SECRET = require('./constants')
const {sequelize} = require('./models')
const app = express();


const server = new ApolloServer({
    typeDefs,
    resolvers,
    context:{models,SECRET}
})

sequelize.sync({force:true})

const PORT = 5000;

server.listen(PORT).then(()=>console.log(`server running on ${PORT}`))


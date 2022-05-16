const express = require('express')
const {ApolloServer} = require('apollo-server-express')
const app = express();
const {sequelize} = require('./models')
const models = require('./models')
const typeDefs = require('./graphQl/schema')
const resolvers = require('./graphQl/resolvers')


const server = new ApolloServer({
    typeDefs,
    resolvers,
    context : {
        models
    }
})



const serverStart = async() => {
    await server.start();
    server.applyMiddleware({app})
}

serverStart();

sequelize.sync({alter : true});

app.listen(3000,() => {
    console.log('server listening on 3000');
})


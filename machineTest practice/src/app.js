const {ApolloServer} = require('apollo-server-express')
const express = require('express')
const typeDefs = require('./schema/typeDefs')
const resolvers = require('./resolver/resolvers')
const jwt = require('jsonwebtoken')
const models = require('./models')
const {sequelize} = require('./models')
const app = express();


const getUser = (token) => {
    try {
        if(token){
            const authUser = jwt.verify(token,process.env.JWT_SECRET)
            return authUser;
        }
        
    }catch(err){
        throw err;
    }
    
}

const server =  new ApolloServer({
    typeDefs,
    resolvers,
    context : ({req}) => {
         const token =req.get("key-token") || ""
         return {user : getUser(token.replace("Bearer","").trim()),models} 
    }
})

const serverStart = async() => {
    await server.start();
    server.applyMiddleware({app})
}

serverStart();

sequelize.sync({alter:true});

app.listen(3000,() => {
    console.log(`server listening on 3000`);
})



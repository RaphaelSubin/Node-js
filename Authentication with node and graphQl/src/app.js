const {ApolloServer} = require('apollo-server')
const {jwt} = require('jsonwebtoken')
const typeDefs = require('./schemas/schema')
const resolvers = require('./resolvers/resolver')
require('dotenv').config()
const {JWT_SECRET, PORT} = process.env


const getUser = (token) => {
    try{
        if(token){
            jwt.verify(token,JWT_SECRET)
        }
        return null
    }catch(error){
        return null
    }
}

const server = new ApolloServer({
    typeDefs,
    resolvers,
    context:({req}) => {
        const token = req.get('Authorization') || ''
        return {user : getUser(token.replace('bearer',''))}
    },
    introspection:true,
    playground:true
})

server.listen(process.env.PORT || 4000).then(({url}) => {
    console.log(`server ready at ${url}`);
})
const {gql} = require('apollo-server-express')


const typeDefs = gql`
    type Query {
        getme:User!
    }

    type Mutation {
       userRegistration(
         name:String!,
         email:String!,
         password:String!
         ):User!
       userLogin(
           email:String!,
           password:String!
           ):login!
    }

    type login {
     user:User!
     token:String!
    }

    type User {
        id:Int!
        name:String!
        email:String!
        password:String!
    }
`

module.exports = typeDefs;
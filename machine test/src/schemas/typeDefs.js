const {gql} = require('apollo-server-express')

const typeDefs = gql`
    type Query{
        getme : User!
        getAllPublicPosts:[Post!]!
        getPosts(limit:Int!,offset:Int):[Post!]!
        hello:String!
    }

    type Mutation {
        userRegistration(
            username:String!,
            email:String!
            phoneNo:String!
            password:String!
            ):User!
        
        userLogin(
            email:String
            phoneNo:Int
            password:String!
        ):loginDetails

        createPost(
            subject:String!
            desription:String!
            post_type:String!
            ):Post!

        removePost(id:Int):String!
        updateStatus(id:Int!,status:String!):Post!
    }

    type User {
        id : Int!
        username:String!
        email:String!
        phoneNo:String!
        password:String!
    }

    type Post {
        subject:String!
        description:String!
        post_type : String!
        status:String!
    }

    type loginDetails {
        user : User!
        token : String!
    }

`

module.exports = typeDefs;
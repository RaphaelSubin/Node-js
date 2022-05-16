const { gql } = require("apollo-server-express");

const typeDefs = gql`
  type Query {
    getAllPublicPosts(limit: Int!, offset: Int!): [Post!]
    getOnePost(id: Int): Post!
    getme: User!
  }

  type Mutation {
    userRegistration(
      name: String!
      email: String!
      phoneNo: String!
      password: String!
    ): User!

    userLogin(emailorPhone: String, password: String!): Login
    createPost(
      subject: String!
      description: String!
      userId: Int!
      post_type: String!
    ): Post!
    updatePost(id:Int!,subject: String!, description: String!): Post!
    createComment(userId:Int!,postId: Int, comment: String!): Comment!
    forgotPassword(email:String!):String!
  }

  type User {
    id:Int!
    name: String!
    email: String!
    phoneNo: String!
    password: String!
    posts: [Post]
  }
  type Post {
    subject: String!
    description: String!
    post_type: String!
    userId: Int
    comments: [Comment]
  }
  type Login {
    user: User!
    token: String!
    msg: String!
  }
  type Comment {
    userId:Int!
    postId: Int!
    comment: String!
  }
  type UserDetails {
    user: User!
    posts: [Post!]!
  }
`;

module.exports = typeDefs;

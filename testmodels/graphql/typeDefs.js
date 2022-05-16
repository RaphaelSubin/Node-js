const { gql } = require("apollo-server");

const typeDefs = gql`
  type Query {
    hello: String!
  }

  type Mutation {
    createCustomer(
      username: String!
      email: String!
      password: String!
    ): Customer!
    createChannel(title: String!, about: String!): Channel!
    customerLogin(email:String!,password:String!):String!
  }
  type Customer {
    username: String!
    email: String!
    password: String!
  }
  type Channel {
    title: String!
    about: String!
  }
`;

module.exports = typeDefs;

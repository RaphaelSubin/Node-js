const { gql } = require("apollo-server-express");

const typeDefs = gql`
  type Mutation {
    register(name: String, email: String, password: Int): ParentToken
  }

  type ParentToken {
    token: String
  }

  type Query {
    hello: String
  }
`;

module.exports = typeDefs;

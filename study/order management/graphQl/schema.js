const { gql } = require("apollo-server-express");

const typeDefs = gql`
  type Query {
    _: String
  }
  type Mutation {
    createOrder(Customer_id: Int!, Orders: [Product_order!]!): String!
  }

  input Product_order {
    Product_id: Int!
    Qty: Int!
  }
`

module.exports = typeDefs;

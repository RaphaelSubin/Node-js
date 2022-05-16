import { gql } from 'apollo-server-express';

export default gql`
  extend type Query {
    CategoryList(size: Int, page: Int): CategoryListpaging!    
    CategoryOne(id: ID!): CategoryList
  }
  extend type Mutation {
    addCategory(name: String!, avatar: Upload!): CategoryList!
    updateCategory(id: ID!, name: String!, avatar: Upload): [Boolean!]
    categoryStatus(id: ID!, status: Int!): [Boolean!]
  }
  type CategoryList {
    id: ID!
    name: String!
    avatar: String!
    status: Int!
  }
  type CategoryListpaging {
    totalItems: Int
    data: [CategoryList!]
    totalPages: Int
    currentPage: Int
  }
`;

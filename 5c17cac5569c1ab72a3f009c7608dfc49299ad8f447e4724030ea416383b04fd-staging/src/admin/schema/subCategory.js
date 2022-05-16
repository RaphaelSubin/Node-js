import { gql } from 'apollo-server-express';

export default gql`
  extend type Query {
    subCategoryList(size: Int, page: Int, catId: Int!): subCategoryListpaging!
    subCategoryOne(id: ID!): SubCategoryList
  }
  extend type Mutation {
    addSubCategory(
      subName: String!
      catId: Int!
      subImage: Upload!
    ): SubCategoryList!
    updateSubCategory(
      id: ID!
      subName: String!
      catId: Int!
      subImage: Upload
    ): [Boolean!]
    SubCategoryStatus(id: ID!, status: Int!): [Boolean!]
  }
  type SubCategoryList {
    id: ID!
    subName: String!
    subImage: String!
    catId: Int!
    status: Int!
  }
  type subCategoryListpaging {
    totalItems: Int
    data: [SubCategoryList!]
    totalPages: Int
    currentPage: Int
  }
`;

import { gql } from 'apollo-server-express';

export default gql`
  extend type Query {
    allsubCategory(size: Int, page: Int, categoryId: Int): SubCategorypaging!
  }
  type SubCategory {
    id: ID!
    subName: String!
    subImage: String!
    catId: Int!
    status: Int!
  }
  type SubCategorypaging {
    totalItems: Int
    data: [SubCategory]
    totalPages: Int
    currentPage: Int
  }
`;

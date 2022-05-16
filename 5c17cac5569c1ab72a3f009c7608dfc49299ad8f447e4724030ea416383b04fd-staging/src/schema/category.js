/* eslint-disable linebreak-style */
import { gql } from 'apollo-server-express';

export default gql`
  extend type Query {
    allCategory(size: Int, page: Int): Categorypaging!
  }
  type Category {
    id: ID!
    name: String!
    avatar: String!
    status: Int!
  }
  type Categorypaging {
    totalItems: Int
    data: [Category!]
    totalPages: Int
    currentPage: Int
  }
`;

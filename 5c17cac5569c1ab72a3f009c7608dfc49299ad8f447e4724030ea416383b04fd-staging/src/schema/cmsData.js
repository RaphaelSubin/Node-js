import { gql } from 'apollo-server-express';

export default gql`
  extend type Query {
    getCmsData(id:ID!): cmsData!
  }


  type cmsData {
    id: ID!
    identifierCode: String
    identifierName: String
    data: String
    status: Int
  }
`;

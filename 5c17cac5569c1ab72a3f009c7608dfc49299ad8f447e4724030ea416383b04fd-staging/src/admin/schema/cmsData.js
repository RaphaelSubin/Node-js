import { gql } from 'apollo-server-express';

export default gql`
  extend type Query {
    cmsDataList(type:Int!): Cms!
  }
  extend type Mutation {   
    updateCmsData(
      id: ID!
      identifierCode: String
      identifierName: String
      data: String
    ): [Boolean!]   
  }
  type Cms {
    id: ID!
    identifierName: String
    data: String
    status: Int!
  }
`;

/* eslint-disable linebreak-style */
import { gql } from 'apollo-server-express';

export default gql`
  extend type Query {
    getTemplates: [Templates!]
  }

  extend type Mutation {
    broadcastNotification(
        sourceType: String!
        type: Int!
        content: String!
        templateId: Int!
        userType: Int!
    ): Message
  }

  type Templates {
    id: ID!
    title: String
    description: String
    type: String
    sourceType: String
    content: String
    status: Int
  }     
`;

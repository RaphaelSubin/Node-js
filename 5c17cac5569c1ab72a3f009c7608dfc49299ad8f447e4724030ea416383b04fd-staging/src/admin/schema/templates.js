import { gql } from 'apollo-server-express';

export default gql`
  extend type Query {
    TemplateList: [TemplateList!]
    TemplateOne(id: ID!): TemplateList
  }
  extend type Mutation {
    addTemplate(
      title: String!
      description: String!
      type: Int!
      sourceType: String
      content: String
    ): TemplateList!
    updateTemplate(
      id: ID!
      title: String!
      description: String!
      type: Int!
      sourceType: String
      content: String
    ): Message
    TemplateStatus(id: ID!, status: Int!): Message
  }
  type TemplateList {
    id: ID!
    title: String!
    description: String!
    type: Int!
    sourceType: String
    content: String
    status: Int!
  }
`;

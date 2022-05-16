import { gql } from 'apollo-server-express';

export default gql`
  extend type Query {
    ModuleList: [ModuleList!]
    ModuleOne(id: ID!): ModuleList
  }
  extend type Mutation {
    addModule(
      moduleName: String!
      display: String!
      priority: Int!
      isMenu: Int!
      url: String!
      icon: String!
      hasOwnLink: Int!
      mainMenuId: Int!
    ): ModuleList!
    updateModule(
      id: ID!
      moduleName: String!
      display: String!
      priority: Int!
      isMenu: Int!
      url: String!
      icon: String!
      hasOwnLink: Int!
      mainMenuId: Int!
    ): Message
    ModuleStatus(id: ID!, status: Int!): Message
  }
  type ModuleList {
    id: ID!
    moduleName: String!
    display: String!
    priority: Int!
    isMenu: Int!
    url: String!
    icon: String!
    hasOwnLink: Int!
    mainMenuId: Int!
    status: Int!
    mainMenu: mainMenuList
  }
  
`;

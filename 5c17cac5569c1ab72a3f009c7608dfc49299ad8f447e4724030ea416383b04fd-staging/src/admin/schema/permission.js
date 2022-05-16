import { gql } from 'apollo-server-express';

export default gql`
  extend type Query {
    getModule: [getModule!]
    getModuleByuser(roleId: Int!): [getModulelist!]
  }
  extend type Mutation {
    addPermission(roleId: Int!, moduleId: [Int]): Message!
  }
  type PermissionList {
    id: ID!
    roleId: Int!
    moduleId: Int!
  }
  type getModule {
    roleId: Int!
    module: ModuleLists
  }
  type getModulelist {
    module: ModuleLists
  }
  type ModuleLists {
    id: ID!
    moduleName: String!
    display: String!
    priority: Int!
    isMenu: Int!
    url: String!
    icon: String!
    hasOwnLink: Int!
    status: Int!
    mainMenu: mainMenuList
  }
`;

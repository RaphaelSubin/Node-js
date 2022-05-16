import { gql } from 'apollo-server-express';

export default gql`
  extend type Query {
    RoleList: [RoleList!]    
    RoleOne(id: ID!): RoleList
  }
  extend type Mutation {
    addRole(userType: String!): RoleList!
    updateRole(id: ID!, userType: String!): [Boolean!]
    RoleStatus(id: ID!, status: Int!): [Boolean!]
  }
  type RoleList {
    id: ID!
    userType: String!   
    status: Int!
  }

`;

import { gql } from 'apollo-server-express';

export default gql`
  extend type Query {
    mainMenuList: [mainMenuList!]    
    mainMenuOne(id: ID!): mainMenuList
  }
  extend type Mutation {
    addmainMenu(name: String!): mainMenuList!
    updatemainMenu(id: ID!, name: String!): [Boolean!]
    mainMenuStatus(id: ID!, status: Int!): [Boolean!]
  }
  type mainMenuList {
    id: ID!
    name: String!   
    status: Int!
  }

`;

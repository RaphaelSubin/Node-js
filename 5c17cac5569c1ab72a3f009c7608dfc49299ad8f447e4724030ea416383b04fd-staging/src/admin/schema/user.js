import { gql } from 'apollo-server-express';

export default gql`
  extend type Query {
    users: [User!]
    userOne(id: ID!): User
    me: User
    getProfile: Profile!
    checkUsername(username: String!): User
  }
  extend type Mutation {
    adminSignIn(email: String!, password: String!): Token!
    adminSignUp(
      displayName: String
      email: String!
      userType: Int!
      password: String!
    ): Message
    editAdminProfile(
      id: ID!
      displayName: String!
      userType: Int!
      profilePic: Upload
    ): Message
    editAdmin(
      id: ID!
      displayName: String!
      userType: Int!
    ): Message
    userPasswordreset(email: String): Message
    changeUserStatus(id: ID!, status: Int!): [Boolean!]
  }
  type Profile {
    id: ID!
    displayName: String!
    email: String!
    userType: String!
    profilePic: String
    roles: RoleList
    status: Int!
  }
  type User {
    id: ID!
    displayName: String!
    email: String!
    userType: String!
    status: Int!
  }
`;

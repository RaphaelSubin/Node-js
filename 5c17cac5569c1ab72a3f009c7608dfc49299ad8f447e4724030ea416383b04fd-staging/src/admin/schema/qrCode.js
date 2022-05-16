import { gql } from 'apollo-server-express';

export default gql`
  extend type Query {
    addQrcode: Qrcode!
    Qrauth(UniqeID: String!): QrauthData!
  }
  extend type Mutation {
    qrLogin(UniqeID: String!): Message
  }
  type Qrcode {
    uniqueId: String!
    fileName: String!
  }
  type QrauthData {
    isLogin: String!
    token: String!
  }
`;

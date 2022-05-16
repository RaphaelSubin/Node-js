import { gql } from 'apollo-server-express';

export default gql`
  extend type Query {
    getWalletDetails(size: Int, page: Int): [walletData]
  }
     
  type walletData {
    id: ID
    points: Int
    amount: Int
    totalAmount: Int
    description: String
    status: Int
  }     
`;

import { gql } from 'apollo-server-express';

export default gql`
  extend type Query {
    getLevelDetails(size: Int, page: Int): [levelData]
    getRewardDetails(size: Int, page: Int): [rewardData]
  }
     
  type levelData {
    id: ID
    userLevel: Int
    status: Int
    createdAt: String
    travellersId: Int
  }     

  type rewardData {
    id: ID
    name: String
    description: String
    userRewards: Int
    travellersId: Int
    status: Int
  } 
`;

/* eslint-disable linebreak-style */
import { gql } from 'apollo-server-express';

export default gql`
  extend type Query {
    myFollowers(size: Int, page: Int):Followpaging!
    myFollowing(size: Int, page: Int):Followpaging!
  }

  extend type Mutation {
    follow(
        travellersId: Int
    ): Message
  }

  type Follow {
    status: Int!
    follower: Travellers
    travellers: Travellers
  }

  type Followpaging {
    totalItems: Int
    data: [Follow!]
    totalPages: Int
    currentPage: Int
  }
`;

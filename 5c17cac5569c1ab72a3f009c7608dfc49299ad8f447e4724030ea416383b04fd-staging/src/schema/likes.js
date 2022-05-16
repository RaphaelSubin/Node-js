import { gql } from 'apollo-server-express';

export default gql`
  extend type Query {
    allLikes(size: Int, page: Int, videoId: Int):Likespaging!
  }

  extend type Mutation {
    addLike(
        videoId: Int!
    ): Message!
    unLikeVideo(
      videoId: Int!
    ): Message!
  }

  type Likes {
    id: ID
    user: [Travellers]
    status: Int
  }

  type Likespaging {
    totalItems: Int
    data: [Likes!]
    totalPages: Int
    currentPage: Int
  }
`;

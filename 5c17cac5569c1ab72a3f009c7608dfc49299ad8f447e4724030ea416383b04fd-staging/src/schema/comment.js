import { gql } from 'apollo-server-express';

export default gql`
  extend type Query {
    allMainComments(size: Int, page: Int, videoId: Int):Commentpaging!
    replyComments(size: Int, page: Int, videoId: Int, commentId: Int!):Commentpaging!
  }

  extend type Mutation {
    addComment(
        comment: String!
        videoId: Int!
        commentId: Int
    ): CommentMsg!

    likeComment(
        commentId: Int
    ): Message!

    unlikeComment(
        commentId: Int
    ): Message!

    deleteComment(
      status: Int!
      commentId: Int!
    ): Message!
  }

  type Comments {
    id: ID!
    travellersId: Int
    videoId: Int 
    comment: String
    replyCount: Int
    likeCount: Int
    traveller: Travellers
    commentId: Int
    commentLikes: [commentLikes]
    createdAt: String
    status: Int!
  }

  type parentComment {
    id: ID
    travellersId: Int
    videoId: Int 
    comment: String
    replyCount: Int
    likeCount: Int
    traveller: Travellers
    commentId: Int
    createdAt: String
    commentLikes: [commentLikes]
    replies: [Comments]
    status: Int!
  }

  type Commentpaging {
    totalItems: Int
    data: [parentComment]
    totalPages: Int
    currentPage: Int
  }

  type CommentDetails {
    id: ID!
    comment: String
    travellersId: Int
    videoId: Int
    commentId: Int
    status: Int
  } 
  type CommentMsg {
    id: ID! 
    comment: String
    travellersId: Int
    videoId: Int  
    commentId: Int
    status: String!
    code: String!
    message: String!
  } 
   type commentLikes {
    id: ID
    commentId: Int
    user: [Travellers]
    status: Int
  }    
`;

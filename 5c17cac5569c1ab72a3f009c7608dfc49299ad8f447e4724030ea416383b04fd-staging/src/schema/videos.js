import { gql } from 'apollo-server-express';

export default gql`
  extend type Query {
    allVideos(size: Int, page: Int):Videopaging!
    nearByVideos(size: Int, page: Int, lat: String, lng: String):Videopaging!
    myFavVideos(size: Int, page: Int):Videopaging!
    myVideos(size: Int, page: Int):Videopaging!
    videoOne(videoId: Int):Video!
  }

  extend type Mutation {
    addVideo(
      categoryId: Int!
      url: String!
      caption: String!
      lat: Float!
      lng: Float!
      thumbnail: String!
      place: String
      isprivate:Int
    ): Message

    deleteVideo(
      videoId: Int!
    ): Message

    changeVideoPrivacy(
      videoId: Int!
      isprivate:Int!
    ): Message
  }

  type Video {
    id: ID!
    url: String!
    thumbnail: String
    categoryId: Int!
    isprivate:Int
    caption: String
    subCategoryId: Int
    lat: Float
    lng: Float
    place: String
    watchtime:Float
    commentCount: Int
    shareCount: Int
    viewCount: Int
    likeCount: Int
    status: Int!
    createdAt: String
    category: category
    likes: [Likes]
    travellers: Travellers
  }
  type Videopaging {
    totalItems: Int
    data: [Video!]
    totalPages: Int
    currentPage: Int
  }
`;

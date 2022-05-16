import { gql } from 'apollo-server-express';

export default gql`
  extend type Query {
    TravelersList(
      userType: Int!
      keyword: String
      size: Int
      page: Int
    ): travelerspaging!
    TravelersOne(id: ID!): travelersdetails!
    VideoList(keyword: String, size: Int, page: Int): Videopaging!
    TravelerVideo(id: ID!, keyword: String, size: Int, page: Int): Videopaging!
  }
  extend type Mutation {
    changeStatus(id: ID!, status: Int!): [Boolean!]
    VideoStatus(id: ID!, status: Int!): [Boolean!]
    TravelersExport(
      userType: Int!
      fields: [String]!
      startDate: String
      endDate: String
    ): fileName!
  }
  type travelerspaging {
    totalItems: Int
    data: [travelers!]
    totalPages: Int
    currentPage: Int
  }
  type travelersdetails {
    travelerProfile: travelers
    followersCount: Int
    followingCount: Int
    videosCount: Int
    shareCount: Int
    likeCount: Int
    commentCount: Int
    bookingCount: Int
    userLevel: Int
  }
  type travelers {
    id: ID!
    firstName: String
    lastName: String
    screenName: String
    emailId: String
    point: Int
    countryCode: String
    country: String
    state: String
    phone: String
    gender: String
    dob: String
    profilePic: String
    socialId: String
    userType: Int
    status: Int
    videosCount: Int
    watchtime: String
    FollowersCount: String
    iscpp: Int
  }

  type fileName {
    fileName: String!
  }
`;

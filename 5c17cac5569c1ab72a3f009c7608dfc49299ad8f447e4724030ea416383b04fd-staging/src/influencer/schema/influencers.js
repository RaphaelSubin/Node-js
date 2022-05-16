import { gql } from 'apollo-server-express';

export default gql`
  extend type Query {
    influencerProfile: influencers!
    influencerOverview(startDate: String, endDate: String): InfluencerOverview!
    influencerAudience(startDate: String, endDate: String): InfluencerAudience!
    influencerRevenue(startDate: String, endDate: String): InfluencerOverview!
    cppRequestList(size: Int, page: Int, iscpp: Int!): influencerspaging!
    cppOneBytoken: cppOne!
  }

  extend type Mutation {
    influencerSignIn(email: String!, password: String!): Token
    cppRequest(id: ID!, iscpp: Int!): Message!
    cppRequestByToken: Message!
    VideoPrivacy(id: ID!, isprivate: Int!): [Boolean!]
  }
  type influencerspaging {
    totalItems: Int
    data: [influencers!]
    totalPages: Int
    currentPage: Int
  }
  type influencers {
    id: ID!
    firstName: String
    lastName: String
    screenName: String
    emailId: String
    point: Int
    countryCode: String
    phone: String
    gender: String
    dob: String
    profilePic: String
    socialId: String
    userType: Int
    status: Int
    videosCount: Int
    FollowersCount: Int
    watchtime: Float
    iscpp: Int
  }
  type cppOne {
    FollowersCount: Int
    watchtime: Float
    iscpp: Int
    isEligible: Boolean
    canReAply: Boolean
    remainingDays: Int
  }
  type InfluencerOverview {
    chartData: [ChartData]
    iscpp: Int
    Topvideos: [Video]
  }
  type ChartData {
    days: String
    dates: String
    FollowersCount: Float
    ViewsCount: Float
    Watchtime: Float   
    TotalClicks: Int
    TotalWatchtime: Float
    TotalViews: Int
    clickAmount: Float
    viewAmount: Float
    watchAmount: Float
    CTR: Float 
    CPC: Float
    Cost: Float
  }
  type InfluencerAudience {
    Gender: gender
    ageGroup: agegroup
    topCountries: [countryData]
    watchTimeFromFollowers:watchTimeFromFollower
  }
  type gender {
    males: Int
    females: Int
  }
  type agegroup {
    fifteenToTwentyFour: Int
    twentyfiveTofortyFour: Int
    fortyfiveTosixty: Int
    sixtyoneToabove: Int
  }  

  type countryData {
    name: String
    watchtime: Float
  }
  type watchTimeFromFollower {
    subscribed: Int
    notSubscribed: Int
  }
  
`;

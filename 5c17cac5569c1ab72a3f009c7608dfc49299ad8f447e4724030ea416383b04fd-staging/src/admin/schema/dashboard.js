import { gql } from 'apollo-server-express';

export default gql`
  extend type Query {
    dashboardDetails: dashboardData!
    dashboardPage(size: Int): dashboardPagedata!
  }

  type dashboardData {
    videosCount: Int
    travellersCount: Int
    influencersCount: Int
    bookingsCount: Int
    hotelsCount: Int
    adsManagersCount: Int
  }

  type dashboardPagedata {
    recentOrders: bookings
    PopularInfluencers: [travelers]
    TrendingVideos: [Video]
    CPPRequest: Video
    AdTotalIncome: Int
    CommissionShared: Int
    LastmonthIncomechart: Int
    CategoryVideoPieChart: [categoryChart]
  }
  type categoryChart {
    id: ID!
    name: String!
    avatar: String!
    status: Int!
    CategoryVideoCount: Int
  }
`;

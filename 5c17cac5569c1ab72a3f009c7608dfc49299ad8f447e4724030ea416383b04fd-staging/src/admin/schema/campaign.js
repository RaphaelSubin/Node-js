import { gql } from 'apollo-server-express';

export default gql`
  extend type Query {
    CampaignList(size: Int, page: Int): CampaignListpaging!
    CampaignOneList(id: Int!): CampaignList!
    CampaignOne(id: ID!): CampaignList
    Campaigncheck: Message!
    CampaignActiveList(size: Int, page: Int): CampaignActiveListpaging!
  }
  extend type Mutation {
    addCampaign(
      name: String!
      object: String!
      category: [Int!]
      country: Int
      budget: Float!
      gender: String!
      ageGroup: String!
      paymentType: Int!
      state: [Int]
    ): Message!

    updateCampaign(
      id: ID!
      name: String!
      object: String!
      category: [Int!]
      country: Int
      budget: Float!
      gender: String!
      ageGroup: String!
      paymentType: Int!
      state: [Int]
    ): Message
    CampaignStatus(id: ID!, status: Int!): Message
  }
  type CampaignActiveList {
    id: ID!
    startDate: String
    endDate: String
    budget: Int!
    clicks: Int
    views: Int
    impress: Float
    paymentType: Int
    status: Int!
    campaign: CampaignList
    adsManager: adManager
  }
  type CampaignList {
    id: ID!
    name: String!
    object: String!
    campaignCategory: [campaignCategory]
    country: Int
    budget: Float!
    gender: String!
    ageGroup: String!
    paymentType: Int!
    campaignState: [campaignState]
    status: Int!
  }
  type CampaignListpaging {
    totalItems: Int
    data: [CampaignList!]
    totalPages: Int
    currentPage: Int
  }
  type CampaignActiveListpaging {
    totalItems: Int
    data: [CampaignActiveList!]
    totalPages: Int
    currentPage: Int
  }
  type campaignCategory {
    categoryId: Int
    category: category
  }
  type campaignState {
    stateId: Int
    state: state
  }
  type category {
    name: String!
  }
  type state {
    name: String!
  }
`;

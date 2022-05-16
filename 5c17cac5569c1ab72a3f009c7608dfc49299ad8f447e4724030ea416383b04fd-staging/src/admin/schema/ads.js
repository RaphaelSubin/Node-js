import { gql } from 'apollo-server-express';

export default gql`
  extend type Query {
    adsList(size: Int, page: Int, campaignId: Int!): adsListpaging!
    adminAdsList(size: Int, page: Int, campaignId: Int!): adsListpaging!    
    adsOne(id: ID!): adsList
    adsInsight: adsInsights!
    adsInsightCountries(size: Int,country:String): [countries!]
    adsInsightStates(size: Int,country:String!,state:String): [states!]

  }
  extend type Mutation {
    addAds(
      name: String!
      videofile: Upload!
      displayName: String!
      url: String!
      cta: String!
      description: String!
      campaignId: Int!
    ): Message

    updateAds(
      id: ID!
      name: String!
      videofile: Upload
      displayName: String!
      url: String!
      cta: String!
      description: String!
      campaignId: Int!
    ): Message
    adsStatus(id: ID!, status: Int!): Message
  }
  type adsList {
    id: ID!
    name: String!
    videofile: String!
    displayName: String!
    url: String!
    cta: String!
    description: String!
    campaignId: Int!
    status: Int!
  }
  type adsInsights {
    Totalusers: Int
    Males: Int
    Females: Int
    TotalInfluencers: String
    TotalTravellers: String
  }
  type adsListpaging {
    totalItems: Int
    data: [adsList!]
    totalPages: Int
    currentPage: Int
  }
  type countries {
    country: String
    countryCount: Int
    Males: Int
    Females: Int
  }
  type states {
    state: String
    stateCount: Int
    Males: Int
    Females: Int
  }
`;

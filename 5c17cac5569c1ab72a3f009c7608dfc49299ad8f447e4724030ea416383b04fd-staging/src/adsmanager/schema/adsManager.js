/* eslint-disable linebreak-style */
import { gql } from 'apollo-server-express';

export default gql`
  extend type Query {
    adManagerList(size: Int, page: Int): adManagerListpaging!
    adManagerCampaign(
      size: Int
      page: Int
      adsManagerId: Int!
    ): CampaignListpaging!
    adManagerOne(id: ID!): adManager
    adManagerWallet: adsManagerWallet
    adManager: adManager
    adManagerProfile: adManager!
    checkadManager(username: String!): adManager
    adminPaymentList(size: Int,page: Int,keyword: String,startDate: String
     ,endDate: String): PaymentListpaging!
    adManagerPaymentList(size: Int,page: Int,keyword: String): PaymentListpaging

  }
  extend type Mutation {
    adsManagerSignIn(email: String!, password: String!): Token!
    adsManagerSignUp(
      displayName: String
      businessName: String!
      email: String!
      password: String!
      phone: String
      website: String
      contactPerson: String
      profilePic: Upload
      services: String
      about: String
      countryId: Int!
    ): Token!
    stripePayment(amount: Float!, currency: String!): StripePayment
    updateAdsManager(
      displayName: String!
      businessName: String!
      phone: String
      website: String
      contactPerson: String
      profilePic: Upload
      services: String
      about: String
      countryId: Int!
    ): Message
    editadsManager(
      id: ID!
      displayName: String!
      businessName: String!
      phone: String
      website: String
      contactPerson: String
      profilePic: Upload
      services: String
      about: String
      countryId: Int!
    ): Message
    adsManagerPwdreset(email: String): Message
    adminPaymentListExport(     
      startDate: String
      endDate: String
    ): fileName!
    adsManagerStatus(id: ID!, status: Int!): [Boolean!]
    adsManagerPayment(
      paymentId: String!
      Amount: Float!
      cardType: Int!
    ): Message
  }
  type adManager {
    id: ID!
    displayName: String
    businessName: String!
    email: String!
    phone: String!
    website: String
    contactPerson: String
    profilePic: String
    services: String
    about: String
    Wallet: Float
    lockWallet: Float
    countryId: Int!
    status: Int!
  }
  type PaymentListpaging {
    totalItems: Int
    data: [PaymentList!]
    totalPages: Int
    currentPage: Int
  }
  type PaymentList {
    id: ID!
    transactionId: String
    paymentId: String
    paymentDate: String
    Amount: Float
    cardType: Int
    status: Int
    adsManager: adManager
  }
  type adManagerListpaging {
    totalItems: Int
    data: [adManager!]
    totalPages: Int
    currentPage: Int
  }
  type AdManagerss {
    id: ID!
    displayName: String
    businessName: String!
    email: String!
    phone: String!
    website: String
    contactPerson: String
    profilePic: String
    services: String
    about: String
    Wallet: Float
    lockWallet: Float
    countryId: Int!
    status: Int!
  }
  type StripePayment {
    clientSecret: String!
    adManagerdata: adManager
  }
  type adsManagerWallet {
    adManagerdata: adManager
    Wallet: Float
    lockWallet: Float
    availableWallet: Float
  }
`;

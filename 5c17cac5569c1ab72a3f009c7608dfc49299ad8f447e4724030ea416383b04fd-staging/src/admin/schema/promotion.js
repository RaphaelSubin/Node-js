import { gql } from 'apollo-server-express';

export default gql`
  extend type Query {
    PromotionList(size: Int, page: Int): PromotionListpaging!
    PromotionOne(id: ID!): PromotionList
  }
  extend type Mutation {
    addPromotion(
      voucherCode: String!
      voucherName: String!
      voucherDesc: String!
      voucherType: String!
      discountType: Int!
      offerValue: Float!
      minAmount: Float!
      discountCap: Float!
      qty: Int!
      custLimt: Int!
      startDate: String!
      endDate: String!
      isNewuser: Int!
    ): PromotionList!

    updatePromotion(
      id: ID!
      voucherCode: String!
      voucherName: String!
      voucherDesc: String!
      voucherType: String!
      discountType: Int!
      offerValue: Float!
      minAmount: Float!
      discountCap: Float!
      qty: Int!
      custLimt: Int!
      startDate: String!
      endDate: String!
      isNewuser: Int!
    ): Message
    PromotionStatus(id: ID!, status: Int!): Message
  }
  type PromotionList {
    id: ID!
    voucherCode: String!
    voucherName: String!
    voucherDesc: String!
    voucherType: String!
    discountType: Int!
    offerValue: String!
    minAmount: Float!
    discountCap: Float!
    qty: Int!
    custLimt: Int!
    startDate: String!
    endDate: String!
    isNewuser: String!
    status: Int!
  }
  type PromotionListpaging {
    totalItems: Int
    data: [PromotionList!]
    totalPages: Int
    currentPage: Int
  }
`;

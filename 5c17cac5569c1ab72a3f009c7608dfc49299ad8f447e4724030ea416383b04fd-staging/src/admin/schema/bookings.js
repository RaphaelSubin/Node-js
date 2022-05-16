import { gql } from 'apollo-server-express';

export default gql`
  extend type Query {
    bookingsList(size: Int, page: Int): bookingspaging!
    bookingsOne(id: ID!): bookings!
    bookingsExport(fields:[String]!): fileName!
  }
  
  type bookingspaging {
    totalItems: Int
    data: [bookings!]
    totalPages: Int
    currentPage: Int
  }
  type bookings {
    id: ID!
    bookingId: String!
    bookedDate: String
    customerName:String
    customerPhone:String
    totalAmount:Float
    checkInDate: String
    checkOutDate: String
    promoApplied: String
    discount: String
    referenceId: String
    isCancelled: String
    stateStatus: String
    userStatus: String
    roomType: String
    addons: String
    noRooms: String
    totalPrice: String
    tax: String
    addonsCharge: String
    orderPrice: String
    isRated: String
    travellers: travelers
    promotions: PromotionList
    hotels: hotels
    status: Int!
  }
`;

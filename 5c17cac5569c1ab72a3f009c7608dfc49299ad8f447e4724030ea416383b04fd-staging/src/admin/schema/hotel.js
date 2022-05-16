import { gql } from 'apollo-server-express';

export default gql`
  extend type Query {
    hotelList(size: Int, page: Int): hotelspaging!
    hotelsOne(id: ID!): hotels!
    hotelsExport(fields:[String]!): fileName!
  }
  
  type hotelspaging {
    totalItems: Int
    data: [hotels!]
    totalPages: Int
    currentPage: Int
  }

  type hotels {
    id: ID!
    hotelId: String!
    hotelName: String!
    address: String
    lat: String
    lng: String
    place: String
    image: String
    bookingsCount: String
    bookings: [bookings]
    status: Int!
  }
`;

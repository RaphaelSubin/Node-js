/* eslint-disable linebreak-style */
import { gql } from 'apollo-server-express';

export default gql`
  extend type Query {
    searchHotels(cityCode: String,latitude: String, longitude: String, checkInDate: String, checkOutDate: String, 
    roomQuantity: String,adults: String,  radius: String, radiusUnit: String, hotelName: String, chains: String, 
    rateCodes: String, amenities: String, ratings: String, priceRange: String,currency: String, paymentPolicy: String,
    boardType: String, includeClosed: String, bestRateOnly: String, sort: String, lang: String): MessageData
    hotelDetails(hotelId: String!): DetailData
    hotelFinalPrice(offerId: String!): DetailData
    # bookHotel(offerId: String!): DetailData
  }
   
  extend type Mutation {
    bookHotel(
      offerId: String!
      title: String!
      firstName: String!
      lastName: String!
      phone: String!
      email: String!
      vendorCode: String! 
      cardNumber: String!
      expiryDate: String!
    ): Message
  }

  type MessageData {
    status: String!
    code: Int!
    data: [HotelData]
  }

  type DetailData {
    status: String
    code: String!
    data: HotelData
  }

  type HotelData {
    type: String
    hotel: Hotel
    offers: [offers]
  }

  type Hotel {
    type: String
    hotelId: String,
    chainCode: String,
    dupeId: String,
    name: String,
    rating: String,
    cityCode: String,
    latitude: String,
    longitude: String,
    hotelDistance: hotelDistance,
    address: address
    contact: contact,
    description: description,
    amenities: String,
    available: Boolean,
    media: media
    
  }  

  type media{
    uri: String
    category:  String
  }  
  
  type hotelDistance{
    distance: String
    distanceUnit:  String
  }

  type offers{
    id: String,
    checkInDate: String,
    checkOutDate: String,
    rateCode: String,
    room: room
    guests: guests
    price: price
    policies: policies
      # rateFamilyEstimated: [Object],
      # room: [Object],
      # guests: [Object],
      # price: [Object],
      # policies: [Object],
    self: String
  }

  type room{
    type: String
    typeEstimated: typeEstimated
    description: description
    # guests: guests
    # price: price
    # policies: policies
  }

  type typeEstimated{
    category: String
    beds: Int
    bedType: String
  }

  type price{
    currency: String
    base: String
    total: String
    variations: variations
    changes: changes
  }
  type changes{
    startDate: String
    endDate: String
    base: String
  }
  type variations{
    average: average
  }
  type average{
    base: String
  }
  type guests{
    adults: String
  }
  type policies{
    paymentType: String
    cancellation: cancellation
    self: String
  }
  type cancellation{
    amount: String
  }

  type address{
    lines: String
    postalCode: String
    cityName: String
    countryCode: String
  }

  type contact{
    phone: String
    fax: String
  }

  type description{
    lang: String
    text: String
  }
`;

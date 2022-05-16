import { gql } from 'apollo-server-express';

export default gql`
  extend type Query {
    travellers: [Travellers!]
    travellerOne(id: ID!): profiledata
    findEmail(emailId: String): Message
    isAvailableScreenName(screenName: String): Message
    travellerMe: Travellers
    getTravellersProfile: Travellers
  }

  extend type Mutation {
    travellerSignUp(
      firstName: String!
      lastName: String
      emailId: String!
      UUID: String!
      screenName: String
      countryCode: String!
      phone: String!
      dob: String
      gender: String
    ): Token

    travellerSignIn(UUID: String!): signinData

    travellerSocialLogin(
      firstName: String
      lastName: String
      screenName: String
      emailId: String
      UUID: String!
      socialId: String!
      gender: String
      dob: String
      userType: Int
      loginType: String!
    ): signinData

    travellerForgotPassword(emailId: String!, resetToken: String!): Message!

    travellersResetPassword(
      resetToken: String!
      newPassword: String!
      confirmPassword: String!
    ): Message!

    travellersChangePassword(
      emailId: String!
      password: String!
      newPassword: String!
      confirmPassword: String!
    ): Message!

    updateFcm(fcmToken: String!, userId: Int!): Message!

    updateProfilePic(profilePic: String!, refreshToken: String!): Message!

    updateUserLanguage(selectedLang: String!): Message!

    removeProfilePic: Message

    updateProfile(
      id: ID!
      firtsName: String
      lastName: String
      screenName: String
      emailId: String
      countryCode: String
      phone: String
      gender: String
      dob: String
      profilePic: String
    ): Message!

    updateLatLng(user_lat: String!, user_lng: String!, userId: Int!): Message!
  }
  type Token {
    token: String!
    travellers: Travellers
  }

  type signinData {
    token: String!
    categoryId: Int
    travellers: Travellers
  }

  type Message {
    status: String!
    code: String!
    message: String!
  }

  type profiledata {
    profile: Travellers
    userLevel: String
    followers: String
    following: String
    videos: [Video]
  }
  type Travellers {
    id: ID!
    firstName: String
    lastName: String
    screenName: String
    emailId: String
    point: Int
    countryCode: String
    phone: String
    password: String
    gender: String
    dob: String
    profilePic: String
    socialId: String
    userType: Int
    status: Int
    sharecount: Int
    viewcount: Int
    watchtime: Int
    userlevel: Int
  }
`;

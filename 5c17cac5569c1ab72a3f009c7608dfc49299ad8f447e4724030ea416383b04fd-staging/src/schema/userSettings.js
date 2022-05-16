import { gql } from 'apollo-server-express';

export default gql`
  extend type Query {
    ggetNotiSettingDetails: Notifications
  }

  extend type Mutation {
    createNotification(
        notificationSound: String, 
        notificationTone: String, 
        notificationVibrate: String, 
        callTone: String, 
        callVibrate: String
    ): Message

    updateNotification(
        notificationSound: String, 
        notificationTone: String, 
        notificationVibrate: String, 
        callTone: String, 
        callVibrate: String
    ): Message
  }

  type Notifications {
    id: ID!
    notificationSound: String, 
    notificationTone: String, 
    notificationVibrate: String, 
    callTone: String, 
    callVibrate: String,
    travellers: Travellers
    status: Int
  }     
`;

import { gql } from 'apollo-server-express';

export default gql`
  extend type Query {
    getNotificationList: [notifications!]
    getNotificationDetails: [notifications!]
    unreadNotification: Unread
  }

  extend type Mutation {
    readNotification(id: ID!): [Boolean!]
  }



  type notifications {
    id: ID!
    sourceType: String
    type: String
    read: String
    trash: String
    content: String
    userId: Int
    notifiedUserId: Int
    templateId: Int
    videoId: Int
    to: Travellers
    from: Travellers
    templates: Templates
    status: Int
  }  

  type Unread {
    notifications: [notifications!]
    totalCount: Int
  }   
`;

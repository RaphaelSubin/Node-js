import { gql } from 'apollo-server-express';

export default gql`
  extend type Query {
    getSettings: settings
  }

  extend type Mutation {
    
    updateSettingData(
        id: ID!
        name: String
        smtpHost: String
        smtpUser: String
        smtpPassword: String
        smtpPort: String
        adminEmail: String
        logo: String
    ): Message!

   
  }

  type settings {
    id: ID!
    name: String
    smtpHost: String
    smtpUser: String
    smtpPassword: String
    smtpPort: String
    adminEmail: String
    logo: String
  }     
    
`;

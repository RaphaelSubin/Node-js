import { gql } from 'apollo-server-express';

export default gql`
  extend type Query {
    countryList: [Country!]
    stateList(countryId:Int!): [State!]
    countryOne(id: ID!): Country
    stateOne(id: ID!): State
  }
  type Country {
    id: ID!
    name: String
    sortname: String
    phonecode: String
  }
  type State {
    id: ID!
    name: String
  }
`;

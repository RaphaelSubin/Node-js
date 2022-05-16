const { gql } = require('apollo-server');

const typeDefs = gql`
  
  scalar Upload

  type File {
    filename: String!
    mimetype: String!
    encoding: String!
  }
  type Query {
    uploads: [File]
  }
  type Mutation {
    singleUpload(file: Upload!): File!
  }
`;

module.exports=typeDefs;
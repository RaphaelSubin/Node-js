import { gql } from 'apollo-server-express';

export default gql`

  extend type Mutation {
    addUserCategory(
        subCategoryId: String,
        categoryId: Int!,
        ): Message
    
    updateUserCategory(
        subCategoryId: String,
        categoryId: Int!,
        ): Message
  }

  
`;

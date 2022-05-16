const { gql } = require("apollo-server");

const typeDefs = gql`
  type User {
    id: Int!
    name: String!
    email: String!
    password: String!
    recipes: [Recipe!]!
  }
  type UserCreate {
    user: User!
    msg: String!
  }

  type GetPage {
    totalItems: Int
    data: User
    totalPages: Int
    currentPage: Int
  }

  type Recipe {
    id: Int!
    userId: Int!
    title: String!
    ingredients: String!
    direction: String!
    user: User!
  }

  type UserRecipes {
    user: User!
    recipe: [Recipe!]!
  }
  type RecipeUser {
    recipe: Recipe
    user: [User!]!
  }

  type Query {
    allUsers: [User!]!

    getSomeUsers(page: Int!, size: Int!): GetPage

    userDetails(id: Int!): UserRecipes!

    allRecipes: [Recipe!]!
    recipeDetails(userId: Int!): RecipeUser
  }

  type Mutation {
    createUser(name: String!, email: String!, password: String!): UserCreate!
    createRecipe(
      userId: Int!
      title: String!
      ingredients: String!
      direction: String!
    ): Recipe!
  }
`;

module.exports = typeDefs;

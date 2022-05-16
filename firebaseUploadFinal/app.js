const express = require("express");
const { ApolloServer } = require("apollo-server-express");
const typeDefs = require("./schema");
const resolvers = require("./resolvers.js");
//const firebase = require('./firebase')

const {
  GraphQLUpload,

  graphqlUploadExpress,
} = require("graphql-upload");

const app = express();

app.use(graphqlUploadExpress());

const server = new ApolloServer({
  typeDefs,
  resolvers,
  playground: {
    endpoint: "/graphql",
  },
});
async function serverStart() {
  await server.start();
  server.applyMiddleware({ app });
}

serverStart();

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("The server started on port " + PORT);
});

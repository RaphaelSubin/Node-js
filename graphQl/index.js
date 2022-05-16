const express = require("express");
const { ApolloServer } = require("apollo-server-express");
const jwt = require("express-jwt");
const typeDefs = require("./schema");
const resolvers = require("./resolver");
const JWT_SECRET = require("./constants");

const app = express();
const auth = jwt({
  secret: JWT_SECRET,
  algorithms:['HS256'],
  credentialsRequired: false,
});
app.use(auth);

const server = new ApolloServer({
  typeDefs,
  resolvers,
  playground: {
    endpoint: "/graphql",
  },
  context: ({ req }) => {
    const user = req.headers.user
      ? JSON.parse(req.headers.user)
      : req.user
      ? req.user
      : null;
    return { user };
  },
});
async function serverStart() {
  await server.start()
  server.applyMiddleware({ app });

}
serverStart();

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("The server started on port " + PORT);
});
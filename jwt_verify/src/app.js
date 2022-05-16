const express = require("express");
const { ApolloServer } = require("apollo-server-express");
const typeDefs = require("./typeDefs/typeDefs");
const resolvers = require("./resolvers/resolvers");
const { User } = require("./models");
const models = require("./models");
const jwt = require("jsonwebtoken");
const app = express();

getUser = (token) => {
  try {
    if (token) {
      const authUser = jwt.verify(token, process.env.JWT_SECRET);
      return authUser;
    }
  } catch (err) {
    throw err;
  }
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => {
    const token = req.headers.authorization || "";
    return { user: getUser(token.replace("Bearer", "").trim()), models };
  },
});

async function serverStart() {
  await server.start();
  server.applyMiddleware({ app });
}

serverStart();

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`server running on ${PORT}`);
});

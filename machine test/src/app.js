const { ApolloServer } = require("apollo-server-express");
const express = require("express");
const typeDefs = require("./schemas/typeDefs");
const resolvers = require("./resolvers/resolvers");
const jwt = require("jsonwebtoken");
const models = require("./models");
const { sequelize } = require("./models");
const app = express();

const getUser = (token) => {
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

sequelize.sync({ alter: true });

const PORT = 4000;

app.listen(PORT, () => {
  console.log(`server running on ${PORT}`);
});

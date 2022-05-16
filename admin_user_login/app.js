const express = require("express");
const typeDefs = require("./graphQl/schema");
const { ApolloServer } = require("apollo-server-express");
const jwt = require("express-jwt");
const router = require("./router");
const resolvers = require("./graphQl/resolver");
const JWT_SECRET = require("./Constants/constants");
const app = express();

const PORT = process.env.PORT || 5000;

const auth = jwt({
  secret: JWT_SECRET,
  algorithms: ["HS256"],
  CredentialRequired: false,
});

//app.use(auth);
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
  await server.start();
  server.applyMiddleware({ app });
}
serverStart();

app.use(express.json());
app.use("/api", router);

app.get("/", (req, res) => {
  res.send("Helloooo");
});

app.listen(PORT, () => {
  console.log(`server listening on port ${PORT}`);
});

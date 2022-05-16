const express = require("express");
var { graphqlHTTP } = require("express-graphql");
const app = express();
const router = require("./Router/router");
const schema = require('./graphql/schema')
const root = require('./graphql/resolver')
//const sequelize = require("./database/db");
const port = process.env.port || 5000;

app.use(express.json());
app.use("/api", router);

app.use(
  "/graphql",
  graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true,
  })
);
app.listen(4000);
console.log("Running a GraphQL API server at http://localhost:4000/graphql");

app.get("/", (req, res) => {
  res.send("Hello world");
}); 

const db = require("./models");
db.sequelize.sync();

app.listen(port, () => {
  console.log("server running");
});

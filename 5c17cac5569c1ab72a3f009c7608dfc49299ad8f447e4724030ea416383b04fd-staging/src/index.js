/* eslint-disable linebreak-style */
/* eslint-disable quotes */
/* eslint-disable linebreak-style */
import cors from 'cors';
import express from 'express';
import { ApolloServer, AuthenticationError } from 'apollo-server-express';
import jwt from "jsonwebtoken";
import "dotenv/config";
import schema from "./schema";
import resolvers from "./resolvers";
import models, { sequelize } from "./models";

const app = express();
app.use(cors());

const getMe = async (req) => {
  const token = req.headers["x-token"];
  if (token) {
    try {
      return await jwt.verify(token, process.env.JWT_SECRET);
    } catch (e) {
      throw new AuthenticationError('Your session expired. Sign in again.');
    }
  }
  return false;
};

const server = new ApolloServer({
  typeDefs: schema,
  resolvers,
  formatError: (error) => {
    const message = error.message
      .replace("SequelizeValidationError: ", "")
      .replace("Validation error: ", "");
    return {
      ...error,
      message,
    };
  },
  // eslint-disable-next-line consistent-return
  context: async ({ req, connection }) => {
    if (connection) {
      return {
        models,
      };
    }
    if (req) {
      const me = await getMe(req);
      // eslint-disable-next-line prefer-destructuring
      const language = req.headers.language;
      return {
        models,
        me,
        language,
        secret: process.env.JWT_SECRET,
      };
    }
  },
});

server.applyMiddleware({ app, path: "/graphql" });

const createUsersWithMessages = async () => {
  await models.user.create({
    displayName: "Admin",
    username: "admin",
    email: "admin@cloudtrav.com",
    password: "123456",
    phone: "0000000000",
    status: 1,
  });

  await models.user.create({
    displayName: "Dev",
    username: "dev",
    email: "dev@cloudtrav.com",
    password: "123456",
    phone: "0000000000",
    status: 1,
  });
};

const eraseDatabaseOnSync = false;

sequelize
  .sync({ force: eraseDatabaseOnSync })
  .then(async () => {
    if (eraseDatabaseOnSync) {
      createUsersWithMessages();
    }

    app.listen({ port: 80 }, () => {
      // eslint-disable-next-line no-console
      console.log("Apollo Server on http://localhost:80/graphql");
    });
  })
  .catch((Err) => {
    throw Err;
  });

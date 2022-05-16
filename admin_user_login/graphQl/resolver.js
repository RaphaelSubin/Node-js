const db = require("../models");
const users = db.user;
const bcrypt = require("bcrypt");
const jsonwebtoken = require("jsonwebtoken");
//const { user } = require('pg/lib/defaults');
const JWT_SECRET = require("../Constants/constants");

const resolvers = {
  Mutation: {
    register: async (_, { name, email, password }) => {
      let user;
      try {
        user = await users.create({
          name,
          email,
          password: await bcrypt.hash(`${password}`, 10),
        });
      } catch (err) {
        console.log(err);
        throw err;
      }

      return {
        // token: jsonwebtoken.sign({ id: user.id, name: user.name }, JWT_SECRET, {
        //   expiresIn: "3hr",
        // }),
        token: jsonwebtoken.sign({ id: 123, name: "subin" }, JWT_SECRET, {
          expiresIn: "3hr",
        }),
      };
    },
  },
  Query: {
    hello: () => {
      return "Hello WOrld";
    },
  },
};

module.exports = resolvers;

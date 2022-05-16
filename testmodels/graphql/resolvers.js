const { AuthenticationError, ValidationError } = require("apollo-server");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const resolvers = {
  Mutation: {
    createCustomer: async (parent, args, { models }) => {
      try {
        const userCreate = await models.Customer.create({
          username: args.username,
          email: args.email,
          password: await bcrypt.hash(args.password, 10),
        });

        return userCreate;
      } catch (err) {
        console.log(err);
        throw new Error(err);
      }
    },

    customerLogin: async (parent, args, { models }) => {
      const CustomerExists = await models.Customer.findOne({
        where: { email: args.email },
      });
      if (!CustomerExists) {
        throw new AuthenticationError("You are not Registered!");
      }

      const passwordCheck = bcrypt.compare(args.password, CustomerExists.password);
      if (!passwordCheck) {
        throw new ValidationError("Password Incorrect!");
      }

      const token = jwt.sign({ username: args.username }, SECRET, {
        expiresIn: "1y",
      });

      return token;
    },
  },
};

module.exports = resolvers;

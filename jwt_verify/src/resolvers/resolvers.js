const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const resolvers = {
  Mutation: {
    userRegistration: async (_, args, { models }) => {
      const userExist = await models.User.findOne({
        where: { email: args.email },
      });
      if (userExist) {
        throw new Error("User already exists!");
      }
      const createUser = models.User.create({
        name: args.name,
        email: args.email,
        password: await bcrypt.hash(args.password, 10),
      });

      return createUser;
    },

    userLogin: async (_, args, { models }) => {
      try {
        const userCheck = await models.User.findOne({
          where: { email: args.email },
        });
        if (!userCheck) {
          throw new Error("user not registred..!");
        }
        const passwordCheck = await bcrypt.compare(
          args.password,
          userCheck.password
        );
        if (!passwordCheck) {
          throw new Error("Incorrect password!");
        }
        const token = jwt.sign({ email: args.email }, process.env.JWT_SECRET, {
          expiresIn: "1y",
        });
        return { user: userCheck, token: token };
      } catch (err) {
        throw new Error(err);
      }
    },
  },
  Query: {
    getme: async (_, args, { user, models }) => {
      if (!user) {
        return "you are not authenticated..";
      }
      return await models.User.findOne({ where: { email: user.email } });
    },
  },
};

module.exports = resolvers;

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { Sequelize } = require("../models");
const op = Sequelize.Op;
const {
  AuthenticationError,
  ValidationError,
} = require("apollo-server-express");

const resolvers = {
  Query: {
    getme: async (_, { user, models }) => {
      if (!user) {
        throw new AuthenticationError("You are not authenticated!");
      }
      return await models.user.findOne({ where: { email: user.email } });
    },
    getAllPublicPosts: async (_, { user, models }) => {
      if (!user) {
        throw new AuthenticationError("You are not authenticated!");
      }
      const posts = await models.Post.findAll(
        { where: { post_type: { [op.like]: "public" } } },
        { raw: true }
      );
      return posts;
    },
    getPosts: async (_, args, { models }) => {
      const posts = await models.Post.findAll({
        limit: args.limit,
        offset: args.offset,
      });
      return posts;
    },
    hello: () => {
      const hello = "hello";
      return hello;
    },
  },
  Mutation: {
    userRegistration: async (_, args, { models }) => {
      try {
        const userExists = await models.User.findOne(
          { where: { email: args.email } },
          { raw: true }
        );
        if (userExists) {
          throw new AuthenticationError("User already exists!");
        }
        const user = models.User.create({
          username: args.username,
          email: args.email,
          phoneNo: args.phoneNo,
          password: await bcrypt.hash(args.password, 10),
        });
        return user;
      } catch (err) {
        throw err;
      }
    },
    userLogin: async (_, args, { models }) => {
      try {
        const Registered = await models.User.findOne({
          where: {
            [op.or]: [{ email: args.email }, { phoneNo: args.phoneNo }],
          },
        });
        if (!Registered) {
          throw new AuthenticationError("User is not registered!");
        }
        const passwordCheck = await bcrypt.compare(
          args.password,
          Registered.password
        );
        if (!passwordCheck) {
          throw new ValidationError("Password Incorrect!");
        }
        const token = jwt.sign(
          {
            id: Registered.id,
            username: Registered.username,
            email: Registered.email,
            phoneNo: Registered.phoneNo,
            password: Registered.password,
          },
          process.env.JWT_SECRET,
          { expiresIn: "1hr" }
        );
        return { user: Registered, token: token };
      } catch (err) {
        throw err;
      }
    },
    createPost: async (_, args, { models }) => {
      const post = await models.Post.create({
        subject: args.subject,
        description: args.description,
        post_type: args.post_type,
        status: args.status,
      });
      return post;
    },
    updateStatus: async (_, args, { models }) => {
      const update = await models.Post.update(
        { status: args.status },
        { where: { id: args.id } }
      );
    },
    removePost: async (_, { id }, { models }) => {
      const deletePost = await models.Post.destroy({ where: { id: id } });
      return "deleted successfully!";
    },
  },
};
module.exports = resolvers;

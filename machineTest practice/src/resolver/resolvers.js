const bcrypt = require("bcrypt");
const sequelize = require("sequelize");
const jwt = require("jsonwebtoken");
const mailer = require('nodemailer')
const op = sequelize.Op;
const {
  AuthenticationError,
  ValidationError,
} = require("apollo-server-express");

const resolvers = {
  Query: {
    getAllPublicPosts: async (parent, args, { user, models }) => {
      try {
        if (!user) {
          throw new AuthenticationError("you are not authenticated!");
        }

        // const [allPosts, comments] = await Promise.all([
        //   models.post.findAll(
        //     {
        //       where: { post_type: "public" },
        //     },
        //     { raw: true }
        //   ),
        //   models.comment.findAll(),
        // ]);
        // const commentMap = new Map();
        // comments.forEach((comment) => {
        //   const postId = comment.postId;
        //   if (commentMap.has(postId)) {
        //     commentMap.get(postId).push(comment);
        //   } else {
        //     commentMap.set(postId, [comment]);
        //   }
        // });
        // const combinedPosts = allPosts.map((post) => {
        //   const postId = post.id;
        //   if (commentMap.has(postId)) {
        //     post.comment = commentMap.get(postId);
        //   } else {
        //     post.comment = [];
        //   }
        //   return post;
        // });
        // return combinedPosts;
        const allPosts = await models.post.findAll({
          where: { post_type: "public" },
          include: {
            model: models.comment,
          },
          limit: args.limit,
          offset: args.offset,
        });
        return allPosts;
      } catch (err) {
        console.log(err);
        throw err;
      }
    },
    getOnePost: async (_, { id }, { user, models }) => {
      try {
        if (!user) {
          throw new AuthenticationError("you are not authenticated!");
        }
        const post = await models.post.findByPk(id);
        return post;
      } catch (err) {
        throw err;
      }
    },
    getme: async (parent, _, { user, models }) => {
      try {
        if (!user) {
          throw new AuthenticationError("you are not authenticated!");
        }
        // const [UserDetails, posts] = await Promise.all[
        //   (models.user.findOne({ where: { email: user.email } }),
        //   models.post.findAll({ where: { userId: user.id } }))
        // ];
        // return { user: UserDetails, post: posts };
        const getuser = await models.user.findOne({
          where: { email: user.email },
          include: {
            model: models.post,
          },
        });
        return getuser;
      } catch (err) {
        throw err;
      }
    },
  },
  Mutation: {
    userRegistration: async (_, args, { models }) => {
      try {
        const userExists = await models.user.findOne({
          where: { email: args.email },
        });
        if (userExists) {
          throw new AuthenticationError("User already exists! plz login..");
        }

        const regEx =
          /^[a-z0-9][a-z0-9-_\.]+@([a-z]|[a-z0-9]?[a-z0-9-]+[a-z0-9])\.[a-z0-9]{2,10}(?:\.[a-z]{2,10})?$/;
        if (!args.email.match(regEx)) {
          throw new Error("Invalid email address");
        }
        const phoneRegex = /^[0-9]{10}$/
        if(!args.phoneNo.match(phoneRegex)) {
          throw new Error('Invalid phone number')
        }

        const user = await models.user.create({
          name: args.name,
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
        const RegisteredUser = await models.user.findOne({
          where: {
            [op.or]: [
              { email: args.emailorPhone },
              { phoneNo: args.emailorPhone },
            ],
          },
        });
        if (!RegisteredUser) {
          throw new AuthenticationError("User not registered!");
        }
        const passwordCheck = await bcrypt.compare(
          args.password,
          RegisteredUser.password
        );
        if (!passwordCheck) {
          throw new ValidationError("password incorrect!");
        }
        const token = jwt.sign(
          {
            id: RegisteredUser.id,
            name: RegisteredUser.name,
            email: RegisteredUser.email,
          },
          process.env.JWT_SECRET,
          { expiresIn: "1d" }
        );

        return {
          token: token,
          user: RegisteredUser,
          msg: "Successfully loggedIn!",
        };
      } catch (err) {
        throw err;
      }
    },
    createPost: async (_, args, { user, models }) => {
      if (!user) {
        throw new AuthenticationError("you are not authenticated!");
      }
      if(!args.userId==user.id){
        throw new Error('you dont have permission')
      }
      const post = await models.post.create({
        subject: args.subject,
        description: args.description,
        userId: args.userId,
        post_type: args.post_type,
      });
      return post;
    },
    updatePost: async (_, args, { user, models }) => {
      if (!user) {
        throw new AuthenticationError("you are not authenticated!");
      }
      

      const post = await models.post.findOne({
        where: { [op.and]: [{ id: args.id }, { userId: user.id }] },
        include: { model: models.comment },
      });
      if (!post) {
        throw new AuthenticationError(`user has no post for id ${args.id}`);
      } else {
        // const update = await models.post.update(
        //   {
        //     subject: args.subject,
        //     description: args.description,
        //   },
        //   { where: { id: args.id } }
        // );
        // return update;
        post.subject = args.subject;
        post.description = args.description;
        await post.save();
        return post;
      }
    },
    createComment: async (_, args, { user, models }) => {
      try {
        if (!user) {
          throw new AuthenticationError("you are not authenticated!");
        }
        if(!args.userId==user.id){
          throw new Error('you cannot comment using that id')
        }
        const comment = await models.comment.create({
          userId:args.userId,
          postId: args.postId,
          comment: args.comment,
        });
        return comment;
      } catch (err) {
        throw err;
      }
    },
    forgotPassword : async (_,{email},{models}) => {
      const user = await models.user.findOne({where : {email:email}});
      if(!user){
        throw new Error('No user with that email')
      }
      
    }
  },
};

module.exports = resolvers;

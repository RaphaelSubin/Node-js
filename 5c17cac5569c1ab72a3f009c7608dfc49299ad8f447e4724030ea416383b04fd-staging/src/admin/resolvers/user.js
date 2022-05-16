import jwt from 'jsonwebtoken';
import { AuthenticationError, UserInputError } from 'apollo-server';
import FirebaseAuth from 'firebaseauth';
const serviceAccount = require('../../assets/file/serviceAccount.json');
const firebase = new FirebaseAuth(serviceAccount.FIREBASE_API_KEY);
import respObj from '../../assets/lang/en.json';
const { authAPI, userAPI } = respObj;
import { Op } from 'sequelize';
import { firebaseUpload } from '../../utils/helpers';
const Path = 'uploads/userProfile/';
const createToken = (id, secret, expiresIn) => {
  const jwtToken = jwt.sign(id, secret, { expiresIn });
  return jwtToken;
};

const firebaseLogin = async (email, password, resp) => {
  try {
    firebase.signInWithEmail(email, password, function (err, result) {
      resp(err?.message, result?.user?.id);
    });
  } catch (error) {
    throw new UserInputError(authAPI.auth_failed);
  }
};

const firebasePasswordreset = async (email, resp) => {
  try {
    firebase.sendPasswordResetEmail(email, function (err, result) {
      resp(err?.message, result?.status);
    });
  } catch (error) {
    throw new UserInputError(authAPI.auth_failed);
  }
};

const firebaseSignup = async (email, password, name, resps) => {
  try {
    firebase.registerWithEmail(email, password, name, function (err, result) {
      resps(err?.message, result?.user?.id);
    });
  } catch (error) {
    throw new UserInputError(authAPI.error_auth);
  }
};

export default {
  Query: {
    users: async (parent, args, { models, me }) => {
      if (!me) {
        throw new AuthenticationError('Your session expired. Sign in again.');
      }
      const condition = { [Op.not]: [{ status: 2 }] };
      const resp = await models.user.findAll({
        where: condition,
        order: [['id', 'DESC']],
      });
      return resp;
    },
    userOne: async (parent, { id }, { models }) => {
      const resp = await models.user.findByPk(id);
      return resp;
    },
    me: async (parent, args, { models, me }) => {
      if (!me) {
        return null;
      }
      const resp = await models.user.findOne({
        where: { refreshToken: me.refreshToken },
      });
      return resp;
    },
    getProfile: async (parent, args, { models, me }) => {
      if (!me) {
        throw new AuthenticationError('Your session expired. Sign in again.');
      }
      const resp = await models.user.findOne({
        where: { refreshToken: me.refreshToken },

        include: [
          {
            model: models.roles,
            as: 'roles',
          },
        ],
      });
      return resp;
    },
    checkUsername: async (parent, { username }, { models }) => {
      const resp = await models.user.findOne({ where: { username } });
      return resp;
    },
  },

  Mutation: {
    adminSignUp: async (
      parent,
      { displayName, email, password, userType },
      { models, secret }
    ) => {
      try {
        const promise = new Promise((resolve, reject) => {
          firebaseSignup(email, password, displayName, (err, res) => {
            if (err) {
              reject(new AuthenticationError(err));
            }
            resolve(res);
          });
        });
        const user = await models.user.create({
          displayName,
          username: displayName,
          email,
          refreshToken: await promise,
          userType,
          status: 1,
        });
        if (!user) {
          reject(new AuthenticationError(authAPI.error_auth));
        }
        firebase.sendPasswordResetEmail(email, function (err, result) {
          if (err) throw new UserInputError(err.message);
        });
        const msg = {
          status: process.env.STATUS_SUCCESS,
          message: userAPI.User_sucess,
        };
        return msg;
      } catch (error) {
        throw new UserInputError(error);
      }
    },
    userPasswordreset: async (parent, { email }, { models, secret }) => {
      try {
        const promise = new Promise((resolve, reject) => {
          firebasePasswordreset(email, (err, res) => {
            if (err) {
              reject(new AuthenticationError(err));
            }
            resolve(res);
          });
        });
        if (await promise) {
          const msg = {
            status: process.env.STATUS_SUCCESS,
            message: userAPI.Password_reset,
          };
          return msg;
        } else {
          new AuthenticationError(authAPI.auth_failed);
        }
      } catch (error) {
        throw new UserInputError(error);
      }
    },
    editAdminProfile: async (
      parent,
      { id, displayName, userType, profilePic },
      { models, secret }
    ) => {
      let postData;
      try {    
        if (profilePic) {
          postData = {
            displayName,
            username: displayName,
            userType,
            profilePic,
          };
          const file = await firebaseUpload(profilePic, Path);
          postData.profilePic =
            file.filename !== undefined ? file.filename : null;
        }
        else{
          postData = {
            displayName,
            username: displayName,
            userType,
          };
        }
        const user = await models.user.update(postData, { where: { id } });
        if (!user) {
          reject(new AuthenticationError(authAPI.error_auth));
        }
        const msg = {
          status: process.env.STATUS_SUCCESS,
          message: userAPI.User_Update,
        };
        return msg;
      } catch (error) {
        throw new UserInputError(error);
      }
    },
    editAdmin: async (
      parent,
      { id, displayName, userType },
      { models, secret }
    ) => {
      try {
        const postData = {
          displayName,
          username: displayName,
          userType,
        };
        const user = await models.user.update(postData, { where: { id } });
        if (!user) {
          reject(new AuthenticationError(authAPI.error_auth));
        }
        const msg = {
          status: process.env.STATUS_SUCCESS,
          message: userAPI.User_Update,
        };
        return msg;
      } catch (error) {
        throw new UserInputError(error);
      }
    },
    adminSignIn: async (parent, { email, password }, { models, secret }) => {
      try {
        const promise = new Promise((resolve, reject) => {
          firebaseLogin(email, password, (err, res) => {
            if (err) {
              reject(new AuthenticationError(err));
            }
            resolve(res);
          });
        });
        const checkUid = await models.user.findOne({
          where: { status: 1, refreshToken: await promise },
        });
        if (checkUid) {
          const users = {
            userType: checkUid.userType,
            email: checkUid.email,
            displayName: checkUid.displayName,
            refreshToken: await promise,
          };
          let tokens = createToken(users, secret, '12h');
          return { token: tokens };
        } else {
          throw new UserInputError(authAPI.email_no_exists);
        }
      } catch (error) {
        throw new UserInputError(error);
      }
    },
    changeUserStatus: async (parent, { id, status }, { models }) => {
      try {
        const data = { status };
        const resp = await models.user.update(data, { where: { id } });
        return resp;
      } catch (error) {
        throw new UserInputError(error);
      }
    },
  },
};

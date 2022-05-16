import jwt from 'jsonwebtoken';
import { AuthenticationError, UserInputError } from 'apollo-server';
import { ApolloError } from 'apollo-server-errors';
import {
  firebaseUpload,
  fcDirectUpload,
  getPagination,
  getPagingData,
  generateCsv,
  uniqueId,
} from '../../utils/helpers';
import FirebaseAuth from 'firebaseauth';
const serviceAccount = require('../../assets/file/serviceAccount.json');
const firebase = new FirebaseAuth(serviceAccount.FIREBASE_API_KEY);
import respObj from '../../assets/lang/en.json';
const { authAPI, userAPI, commonAPI, messageAPI } = respObj;
import { Op } from 'sequelize';
const sequelize = require('sequelize');
const stripe = require('stripe')(process.env.STRIPE_KEY);
const fileName = `paymentexport-${uniqueId()}.csv`;
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
    adManagerList: async (parent, { size, page }, { models, me }) => {
      if (!me) {
        throw new AuthenticationError('Your session expired. Sign in again.');
      }
      try {
        const condition = { [Op.not]: [{ status: 2 }] };
        const { limit, offset } = getPagination(page, size);
        const resp = await models.adsManager.findAndCountAll({
          where: condition,
          order: [['id', 'DESC']],
          limit,
          offset,
        });
        const response = getPagingData(resp, page, limit);
        return response;
      } catch (error) {
        throw new UserInputError(error);
      }
    },
    adManagerOne: async (parent, { id }, { models }) => {
      const resp = await models.adsManager.findByPk(id);
      return resp;
    },
    adManagerCampaign: async (
      parent,
      { size, page, adsManagerId },
      { models }
    ) => {
      try {
        const condition = { [Op.not]: [{ status: 2 }], adsManagerId };
        const { limit, offset } = getPagination(page, size);
        const resp = await models.campaign.findAndCountAll({
          where: condition,
          order: [['id', 'DESC']],
          limit,
          offset,
        });
        const response = getPagingData(resp, page, limit);
        return response;
      } catch (error) {
        throw new UserInputError(error);
      }
    },
    adminPaymentList: async (parent, { size, page, keyword,startDate,endDate }, { models }) => {
      let condition;
      let conditions;
      try {
        if (startDate && endDate && keyword) {
          condition = {  
            [Op.or]: [
              { transactionId: { [Op.iLike]: `%${keyword}%` } },
              { paymentId: { [Op.iLike]: `%${keyword}%` } },
              { paymentDate: { [Op.iLike]: `%${keyword}%` } },           
              ],   
            [Op.and]: [
              sequelize.where(
                sequelize.fn('date', sequelize.col('paymentDate')),
                '>=',
                startDate,
              ),
              sequelize.where(
                sequelize.fn('date', sequelize.col('paymentDate')),
                '<=',
                endDate,
              ),
            ],
            [Op.not]: [{ status: 2 }],
          };
          conditions = {  
            [Op.or]: [    
              { displayName: { [Op.iLike]: `%${keyword}%` } },
              { businessName: { [Op.iLike]: `%${keyword}%` } },             
              ], 
          };
        }
        else if (startDate && endDate) {
          condition = {  
            [Op.and]: [
              sequelize.where(
                sequelize.fn('date', sequelize.col('paymentDate')),
                '>=',
                startDate,
              ),
              sequelize.where(
                sequelize.fn('date', sequelize.col('paymentDate')),
                '<=',
                endDate,
              ),
            ],
            [Op.not]: [{ status: 2 }],
          };
        }
        else if (keyword) {
          condition = {  
            [Op.or]: [
              { transactionId: { [Op.iLike]: `%${keyword}%` } },
              { paymentId: { [Op.iLike]: `%${keyword}%` } },
              { paymentDate: { [Op.iLike]: `%${keyword}%` } },                      
              ], 
            [Op.not]: [{ status: 2 }],
          };
          conditions = {  
            [Op.or]: [    
              { displayName: { [Op.iLike]: `%${keyword}%` } },
              { businessName: { [Op.iLike]: `%${keyword}%` } },             
              ], 
          };
        }        
        else{
        condition = { [Op.not]: [{ status: 2 }] };
        }
        const { limit, offset } = getPagination(page, size);
        const resp = await models.adsPayment.findAndCountAll({
          include: [
            {
              model: models.adsManager,
              as: 'adsManager',
              where: conditions,
            },
          ],
          where: condition,
          order: [['id', 'DESC']],
          limit,
          offset,
        });
        const response = getPagingData(resp, page, limit);
        return response;
      } catch (error) {
        throw new UserInputError(error);
      }
    },
    adManagerPaymentList: async (parent, { size, page, keyword }, { models, me }) => {
      if (!me) {
        throw new AuthenticationError(authAPI.auth_failed);
      }
      let condition;
      try {
        if (keyword) {
          condition = {  
            [Op.or]: [
              { transactionId: { [Op.iLike]: `%${keyword}%` } },
              { paymentId: { [Op.iLike]: `%${keyword}%` } },
              { paymentDate: { [Op.iLike]: `%${keyword}%` } },                      
              ], 
            [Op.not]: [{ status: 2 }],
          };
        }        
        else{
        condition = { adsManagerId: me.Id,[Op.not]: [{ status: 2 }] };
        }
        const { limit, offset } = getPagination(page, size);
        const resp = await models.adsPayment.findAndCountAll({  
          where: condition,
          order: [['id', 'DESC']],
          limit,
          offset,
        });
        const response = getPagingData(resp, page, limit);
        return response;
      } catch (error) {
        throw new UserInputError(error);
      }
    },
    adManager: async (parent, args, { models, me }) => {
      if (!me) {
        return null;
      }
      const resp = await models.adsManager.findByPk(me.id);
      return resp;
    },
    adManagerWallet: async (parent, args, { models, me }) => {
      if (!me) {
        throw new AuthenticationError(authAPI.auth_failed);
      }
      const resp = await models.adsManager.findOne({
        where: { refreshToken: me.refreshToken, status: 1 },
      });
      const Totalamount = resp.Wallet;
      const lockWallet = resp.lockWallet;
      const availableWallet = Totalamount - lockWallet;
      const data = {
        adManagerdata: resp,
        Wallet: Totalamount,
        lockWallet,
        availableWallet,
      };
      return data;
    },
    adManagerProfile: async (parent, args, { models, me }) => {
      if (!me) {
        throw new AuthenticationError(authAPI.auth_failed);
      }
      const resp = await models.adsManager.findOne({
        where: { refreshToken: me.refreshToken, status: 1 },
      });
      return resp;
    },
    checkadManager: async (parent, { username }, { models }) => {
      const resp = await models.adsManager.findOne({ where: { username } });
      return resp;
    },
  },

  Mutation: {
    adsManagerSignUp: async (parent, args, { models, secret }) => {
      let data;
      try {
        const promise = new Promise((resolve, reject) => {
          firebaseSignup(
            args.email,
            args.password,
            args.displayName,
            (err, res) => {
              if (err) {
                reject(new AuthenticationError(err));
              }
              resolve(res);
            }
          );
        });

        if (args.profilePic) {
          data = {
            ...args,
            username: args.displayName,
            refreshToken: await promise,
            status: 1,
          };
          const file = await firebaseUpload(args.profilePic, Path);
          data.profilePic = file.filename !== undefined ? file.filename : null;
        } else {
          data = {
            ...args,
            username: args.displayName,
            refreshToken: await promise,
            status: 1,
          };
        }
        const user = await models.adsManager.create(data);
        if (!user) {
          reject(new AuthenticationError(authAPI.error_auth));
        }
        firebase.sendPasswordResetEmail(args.email, function (err, result) {
          if (err) throw new UserInputError(err.message);
        });
        const users = {
          Id: checkUid.id,
          email: args.email,
          displayName: args.displayName,
          refreshToken: await promise,
        };
        let tokens = createToken(users, secret, '12h');
        return { token: tokens };
      } catch (error) {
        throw new UserInputError(error);
      }
    },
    adsManagerPwdreset: async (parent, { email }, { models, secret }) => {
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
            status: authAPI.success,
            code: authAPI.codeSuccess,
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
    editadsManager: async (
      parent,
      { id, displayName, companyName, profilePic },
      { models }
    ) => {
      let postData;
      try {
        if (profilePic) {
          postData = {
            displayName,
            companyName,
            profilePic,
            username: displayName,
          };
          const file = await firebaseUpload(profilePic, Path);
          postData.profilePic =
            file.filename !== undefined ? file.filename : null;
        } else {
          postData = {
            displayName,
            companyName,
            username: displayName,
          };
        }
        const user = await models.adsManager.update(postData, {
          where: { id },
        });
        if (!user) {
          reject(new AuthenticationError(authAPI.error_auth));
        }
        const msg = {
          status: authAPI.success,
          code: authAPI.codeSuccess,
          message: commonAPI.Update,
        };
        return msg;
      } catch (error) {
        throw new UserInputError(error);
      }
    },
    adsManagerPayment: async (parent, args, { models, me }) => {
      if (!me) {
        throw new AuthenticationError(authAPI.auth_failed);
      }
      let data;
      let datetime = new Date();
      const today = datetime.toISOString().slice(0, 10);
      const UniqeID = uniqueId();
      try {
        data = {
          ...args,
          adsManagerId: me.Id,
          paymentDate: today,
          transactionId: UniqeID,
          status: 1,
        };
        await models.adsPayment.create(data);
        const totalAmount = await models.adsPayment.findAll({
          raw: true,
          where: { adsManagerId: me.Id, status: 1 },
          attributes: [
            'adsManagerId',
            [sequelize.fn('sum', sequelize.col('Amount')), 'totalAmount'],
          ],
          group: ['adsManagerId'],
        });
        let Tamount = totalAmount[0].totalAmount;
        let Totalamount = Tamount.toFixed(2);
        const ads = { Wallet: Totalamount };
        await models.adsManager.update(ads, {
          where: { refreshToken: me.refreshToken, status: 1 },
        });

        const msg = {
          status: authAPI.success,
          code: authAPI.codeSuccess,
          message: messageAPI.paymentSuccess,
        };
        return msg;
      } catch (error) {
        throw new UserInputError(error);
      }
    },
    stripePayment: async (parent, args, { models, me }) => {
      if (!me) {
        throw new AuthenticationError(authAPI.auth_failed);
      }
      try {
        const paymentIntent = await stripe.paymentIntents.create({
          amount: args.amount,
          currency: args.currency,
          metadata: { integration_check: 'accept_a_payment' },
        });
        const adManagerdata = await models.adsManager.findOne({
          where: { refreshToken: me.refreshToken, status: 1 },
        });
        const msg = {
          clientSecret: paymentIntent.client_secret,
          adManagerdata,
        };
        return msg;
      } catch (error) {
        throw new UserInputError(error);
      }
    },
    updateAdsManager: async (parent, args, { models, me }) => {
      if (!me) {
        throw new AuthenticationError(authAPI.auth_failed);
      }
      let data;
      try {
        if (args.profilePic) {
          data = { ...args };
          const file = await firebaseUpload(args.profilePic, Path);
          data.profilePic = file.filename !== undefined ? file.filename : null;
        } else {
          data = { ...args };
          delete data.profilePic;
        }
        const user = await models.adsManager.update(data, {
          where: { refreshToken: me.refreshToken, status: 1 },
        });
        if (!user) {
          reject(new AuthenticationError(authAPI.error_auth));
        }
        const msg = {
          status: authAPI.success,
          code: authAPI.codeSuccess,
          message: commonAPI.Update,
        };
        return msg;
      } catch (error) {
        throw new UserInputError(error);
      }
    },
    adsManagerSignIn: async (
      parent,
      { email, password },
      { models, secret }
    ) => {
      try {
        const promise = new Promise((resolve, reject) => {
          firebaseLogin(email, password, (err, res) => {
            if (err) {
              reject(new AuthenticationError(err));
            }
            resolve(res);
          });
        });
        const checkUid = await models.adsManager.findOne({
          where: { status: 1, refreshToken: await promise },
        });
        if (checkUid) {
          const users = {
            Id: checkUid.id,
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
    adminPaymentListExport: async (
      parent,
      { startDate, endDate },
      { models }
    ) => {
      let condition;
      try {
        if (startDate && endDate) {
          condition = {
            [Op.and]: [
              sequelize.where(
                sequelize.fn('date', sequelize.col('paymentDate')),
                '>=',
                startDate
              ),
              sequelize.where(
                sequelize.fn('date', sequelize.col('paymentDate')),
                '<=',
                endDate
              ),
            ],
            [Op.not]: [{ status: 2 }],
          };
        } else {
          condition = { [Op.not]: [{ status: 2 }] };
        }
        const resp = await models.adsPayment.findAll({
          attributes: [
            'transactionId','paymentId','paymentDate', 'Amount',
            [sequelize.col('adsManager.displayName'), 'Name'],
            [sequelize.col('adsManager.businessName'), 'Business Name'],
            [sequelize.col('adsManager.email'), 'Email'], 
            [sequelize.col('adsManager.contactPerson'), 'contact Person'],
          ],
          include: [
            {
              model: models.adsManager,
              as: 'adsManager',
              attributes: [],
            },
          ],      
          raw:true,
          where: condition,
          order: [['id', 'DESC']],
        });
        if (resp.length === 0) {   
          throw new ApolloError(authAPI.no_data, 'MY_ERROR_CODE');

        }
        await generateCsv('', resp, fileName);
        const path = `./${fileName}`;
        const file = await fcDirectUpload(path);
        const msg = {
          fileName: file.filename,
        };
        return msg;
      } catch (error) {
        throw new UserInputError(error);
      }
    },
  
    adsManagerStatus: async (parent, { id, status }, { models }) => {
      try {
        const data = { status };
        const resp = await models.adsManager.update(data, { where: { id } });
        return resp;
      } catch (error) {
        throw new UserInputError(error);
      }
    },
  },
};

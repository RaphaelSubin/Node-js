import { AuthenticationError, UserInputError } from 'apollo-server';
import { Op } from 'sequelize';
import {
  getPagination,
  getPagingData,
  firebaseUpload,
} from '../../utils/helpers';
import respObj from '../../assets/lang/en.json';

const { authAPI, commonAPI } = respObj;
const Path = 'uploads/ads/';
const sequelize = require('sequelize');

export default {
  Query: {
    adsList: async (parent, { size, page, campaignId }, { models }) => {
      try {
        const condition = { campaignId, [Op.not]: [{ status: 2 }] };
        const { limit, offset } = getPagination(page, size);
        const resp = await models.ads.findAndCountAll({
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
    adminAdsList: async (parent, { size, page, campaignId }, { models }) => {
      try {
        const condition = { campaignId, [Op.not]: [{ status: 2 }] };
        const { limit, offset } = getPagination(page, size);
        const resp = await models.ads.findAndCountAll({
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
    adsOne: async (parent, { id }, { models }) => {
      try {
        const resp = await models.ads.findByPk(id);
        return resp;
      } catch (error) {
        throw new UserInputError(error);
      }
    },
    adsInsight: async (parent, args, { models, me }) => {
      try {
        if (!me) {
          throw new AuthenticationError(authAPI.auth_failed);
        }
        const condition = { [Op.not]: [{ status: 2 }] };
        const Totalusers = await models.travellers.count({
          where: condition,
        });
        const Males = await models.travellers.count({
          where: { [Op.not]: [{ status: 2 }], gender: 'male' },
        });
        const Females = await models.travellers.count({
          where: { [Op.not]: [{ status: 2 }], gender: 'female' },
        });
        const TotalInfluencers = await models.travellers.count({
          where: { [Op.not]: [{ status: 2 }], userType: 2 },
        });
        const TotalTravellers = await models.travellers.count({
          where: { [Op.not]: [{ status: 2 }], userType: 1 },
        });
        return {
          Totalusers,
          Females,
          Males,
          TotalInfluencers,
          TotalTravellers,
        };
      } catch (error) {
        throw new UserInputError(error);
      }
    },
    adsInsightCountries: async (parent, args, { models, me }) => {
      let condition;
      try {
        if (!me) {
          throw new AuthenticationError(authAPI.auth_failed);
        }
        if (args.country) {
          condition = {
            country: args.country,
            [Op.not]: [{ status: 2 }],
          };
        } else {
          condition = {
            [Op.not]: [{ status: 2 }],
          };
        }
        const Country = await models.travellers.findAll({
          where: condition,
          group: ['country', 'gender'],
          limit: args.size,
          raw: true,
          attributes: [
            'country',
            'gender',
            [sequelize.fn('COUNT', 'country'), 'countryCount'],
          ],
        });

        const Countries = [];
        for (const Country of Country) {
          const Males = await models.travellers.count({
            where: {
              [Op.not]: [{ status: 2 }],
              country: Country.country,
              gender: 'male',
            },
          });

          const Females = await models.travellers.count({
            where: {
              [Op.not]: [{ status: 2 }],
              country: Country.country,
              gender: 'female',
            },
          });
          const res = {
            country: Country.country,
            countryCount: Country.countryCount,
            Males,
            Females,
          };
          Countries.push(res);
        }
        return Countries;
      } catch (error) {
        throw new UserInputError(error);
      }
    },
    adsInsightStates: async (parent, args, { models, me }) => {
      let condition;
      try {
        if (!me) {
          throw new AuthenticationError(authAPI.auth_failed);
        }
        if (args.state) {
          condition = {
            state: args.state,
            country: args.country,
            [Op.not]: [{ status: 2 }],
          };
        } else {
          condition = {
            country: args.country,
            [Op.not]: [{ status: 2 }],
          };
        }
        const State = await models.travellers.findAll({
          where: condition,
          group: ['state', 'gender'],
          limit: args.size,
          raw: true,
          attributes: [
            'state',
            'gender',
            [sequelize.fn('COUNT', 'state'), 'stateCount'],
          ],
        });
        const states = [];
        for (const State of State) {
          const Males = await models.travellers.count({
            where: {
              [Op.not]: [{ status: 2 }],
              state: State.state,
              gender: 'male',
            },
          });

          const Females = await models.travellers.count({
            where: {
              [Op.not]: [{ status: 2 }],
              state: State.state,
              gender: 'female',
            },
          });
          const res = {
            state: State.state,
            stateCount: State.stateCount,
            Males,
            Females,
          };
          states.push(res);
        }
        return states;
      } catch (error) {
        throw new UserInputError(error);
      }
    },
  },

  Mutation: {
    addAds: async (parent, args, { models }) => {
      try {
        const data = { ...args, status: 1 };
        if (args.videofile) {
          const file = await firebaseUpload(args.videofile, Path);
          data.videofile = file.filename !== undefined ? file.filename : null;
        }
        await models.ads.create(data);

        const msg = {
          status: process.env.STATUS_SUCCESS,
          message: commonAPI.Sucess,
        };
        return msg;
      } catch (error) {
        throw new UserInputError(error);
      }
    },

    updateAds: async (parent, args, { models }) => {
      try {
        const data = { ...args, status: 1 };
        const uid = data.id;
        if (args.videofile) {
          const file = await firebaseUpload(args.videofile, Path);
          data.videofile = file.filename !== undefined ? file.filename : null;
        }
        await models.ads.update(data, {
          where: { id: uid },
        });
        const msg = {
          status: process.env.STATUS_SUCCESS,
          message: commonAPI.Update,
        };
        return msg;
      } catch (error) {
        throw new UserInputError(error);
      }
    },
    adsStatus: async (parent, { id, status }, { models }) => {
      try {
        const data = { status };
        await models.ads.update(data, { where: { id } });
        const msg = {
          status: process.env.STATUS_SUCCESS,
          message: commonAPI.Update,
        };
        return msg;
      } catch (error) {
        throw new UserInputError(error);
      }
    },
  },
};

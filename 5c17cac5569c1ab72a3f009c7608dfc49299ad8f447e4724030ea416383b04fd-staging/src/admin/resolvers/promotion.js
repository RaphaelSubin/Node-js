import { UserInputError } from 'apollo-server';
import { Op } from 'sequelize';
import { getPagination, getPagingData } from '../../utils/helpers';
import respObj from '../../assets/lang/en.json';

const { userAPI, commonAPI } = respObj;

export default {
  Query: {
    PromotionList: async (parent, { size, page }, { models, me }) => {
      try {
        const condition = { [Op.not]: [{ status: 2 }] };
        const { limit, offset } = getPagination(page, size);
        const resp = await models.promotion.findAndCountAll({
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
    PromotionOne: async (parent, { id }, { models }) => {
      try {
        const resp = await models.promotion.findByPk(id);
        return resp;
      } catch (error) {
        throw new UserInputError(error);
      }
    },
  },

  Mutation: {
    addPromotion: async (parent, args, { models }) => {
      try {
        if (Date.parse(args.endDate) < Date.parse(args.startDate)) {
          throw new UserInputError(userAPI.validate_end_date);
        }
        const data = { ...args, status: 1 };
        const insert = await models.promotion.create(data);
        return insert;
      } catch (error) {
        throw new UserInputError(error);
      }
    },

    updatePromotion: async (parent, args, { models }) => {
      try {
        if (Date.parse(args.endDate) < Date.parse(args.startDate)) {
          throw new UserInputError(userAPI.validate_end_date);
        }
        const data = { ...args, status: 1 };
        const uid = data.id;
        await models.promotion.update(data, {
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
    PromotionStatus: async (parent, { id, status }, { models }) => {
      try {
        const data = { status };
        await models.promotion.update(data, { where: { id } });
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

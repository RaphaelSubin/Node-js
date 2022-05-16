import { UserInputError } from 'apollo-server';
// eslint-disable-next-line import/named
import { getPagination, getPagingData } from '../utils/helpers';

const { Op } = require('sequelize');

export default {
  Query: {
    allCategory: async (parent, { size, page }, { models }) => {
      try {
        const condition = { [Op.not]: [{ status: 2 }] };
        const { limit, offset } = getPagination(page, size);
        const resp = await models.category.findAndCountAll({
          where: condition,
          limit,
          offset,
        });
        const response = getPagingData(resp, page, limit);
        return response;
      } catch (error) {
        throw new UserInputError(error);
      }
    },
  },

};

import { UserInputError } from 'apollo-server';
// eslint-disable-next-line import/named
import { getPagination, getPagingData } from '../utils/helpers';

const { Op } = require('sequelize');

export default {
  Query: {
    allsubCategory: async (parent, { size, page, categoryId }, { models }) => {
      try {
        const condition = { [Op.not]: [{ status: 2 }], catId: categoryId };
        const { limit, offset } = getPagination(page, size);
        const resp = await models.subCategory.findAndCountAll({
          where: [condition],
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

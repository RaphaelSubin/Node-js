import { UserInputError } from 'apollo-server';
import { Op } from 'sequelize';

export default {
  Query: {
    cmsDataList: async (parent, { type }, { models }) => {
      try {
        const condition = { id: type, [Op.not]: [{ status: 2 }] };
        const resp = await models.cmsData.findOne({
          where: condition,
        });
        return resp;
      } catch (error) {
        throw new UserInputError(error);
      }
    },
  },

  Mutation: {
    updateCmsData: async (
      parent,
      { identifierCode, identifierName, data, id },
      { models }
    ) => {
      try {
        const datas = {
          identifierCode,
          identifierName,
          data,
          status: 1,
        };
        const update = await models.cmsData.update(datas, {
          where: { id },
        });
        return update;
      } catch (error) {
        throw new UserInputError(error);
      }
    },
  },
};

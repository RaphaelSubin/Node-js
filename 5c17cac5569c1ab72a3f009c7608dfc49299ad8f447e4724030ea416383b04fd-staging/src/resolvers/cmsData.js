import { UserInputError } from 'apollo-server';

export default {
  Query: {
    getCmsData: async (parent, { id }, { models }) => {
      try {
        const resp = await models.cmsData.findOne({
          where: { id },
        });
        return resp;
      } catch (error) {
        throw new UserInputError(error);
      }
    },
  },

};

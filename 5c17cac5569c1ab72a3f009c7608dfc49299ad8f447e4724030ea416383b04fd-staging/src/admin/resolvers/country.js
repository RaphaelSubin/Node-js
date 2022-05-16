import { UserInputError } from 'apollo-server';

export default {
  Query: {
    countryList: async (parent, args, { models }) => {
      try {
        const resp = await models.country.findAll();
        return resp;
      } catch (error) {
        throw new UserInputError(error);
      }
    },
    stateList: async (parent, args, { models }) => {
      try {
        const resp = await models.states.findAll({
          where: { countryid: args.countryId },
        });
        return resp;
      } catch (error) {
        throw new UserInputError(error);
      }
    },
    countryOne: async (parent, { id }, { models }) => {
      const resp = await models.country.findByPk(id);
      return resp;
    },
    stateOne: async (parent, { id }, { models }) => {
      const resp = await models.states.findByPk(id);
      return resp;
    },
  },
};

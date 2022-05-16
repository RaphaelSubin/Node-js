import { UserInputError } from 'apollo-server';
import { Op } from 'sequelize';

export default {
  Query: {
    mainMenuList: async (parent, args, { models }) => {
      try {
        const condition = { [Op.not]: [{ status: 2 }] };
        const resp = await models.mainMenu.findAll({
          where: condition,
        });
        return resp;
      } catch (error) {
        throw new UserInputError(error);
      }
    },
    mainMenuOne: async (parent, { id }, { models }) => {
      try {
        const resp = await models.mainMenu.findByPk(id);
        return resp;
      } catch (error) {
        throw new UserInputError(error);
      }
    },
  },

  Mutation: {
    addmainMenu: async (parent, { name }, { models }) => {
      try {
        const data = { name, status: 1 };
        const insert = await models.mainMenu.create(data);
        return insert;
      } catch (error) {
        throw new UserInputError(error);
      }
    },

    updatemainMenu: async (parent, { name, id }, { models }) => {
      try {
        const data = { name };
        const update = await models.mainMenu.update(data, { where: { id } });
        return update;
      } catch (error) {
        throw new UserInputError(error);
      }
    },
    mainMenuStatus: async (parent, { id, status }, { models }) => {
      try {
        const data = { status };
        const resp = await models.mainMenu.update(data, { where: { id } });
        return resp;
      } catch (error) {
        throw new UserInputError(error);
      }
    },
  },
};

import { UserInputError } from 'apollo-server';
import { Op } from 'sequelize';
import respObj from '../../assets/lang/en.json';

const { commonAPI } = respObj;
export default {
  Query: {
    ModuleList: async (parent, args, { models }) => {
      try {
        const condition = { [Op.not]: [{ status: 2 }] };
        const resp = await models.module.findAll({
          where: condition,
          include: [
            {
              model: models.mainMenu,
              as: 'mainMenu',
            },
          ],
        });
        return resp;
      } catch (error) {
        throw new UserInputError(error);
      }
    },
    ModuleOne: async (parent, { id }, { models }) => {
      try {
        const resp = await models.module.findByPk(id);
        return resp;
      } catch (error) {
        throw new UserInputError(error);
      }
    },
  },

  Mutation: {
    addModule: async (parent, args, { models }) => {
      try {
        const data = { ...args, status: 1 };
        const insert = await models.module.create(data);
        return insert;
      } catch (error) {
        throw new UserInputError(error);
      }
    },

    updateModule: async (parent, args, { models }) => {
      try {
        const data = { ...args, status: 1 };
        const uid = data.id;
        await models.module.update(data, {
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
    ModuleStatus: async (parent, { id, status }, { models }) => {
      try {
        const data = { status };
        await models.module.update(data, { where: { id } });
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

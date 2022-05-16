import { UserInputError } from 'apollo-server';
import { Op } from 'sequelize';
import respObj from '../../assets/lang/en.json';

const { commonAPI } = respObj;

export default {
  Query: {
    TemplateList: async (parent, args, { models }) => {
      try {
        const condition = { [Op.not]: [{ status: 2 }] };
        const resp = await models.templates.findAll({
          where: condition,
          order: [['id', 'DESC']],
        });
        return resp;
      } catch (error) {
        throw new UserInputError(error);
      }
    },
    TemplateOne: async (parent, { id }, { models }) => {
      try {
        const resp = await models.templates.findByPk(id);
        return resp;
      } catch (error) {
        throw new UserInputError(error);
      }
    },
  },

  Mutation: {
    addTemplate: async (parent, args, { models }) => {
      try {
        const data = { ...args, status: 1 };
        const insert = await models.templates.create(data);
        return insert;
      } catch (error) {
        throw new UserInputError(error);
      }
    },

    updateTemplate: async (parent, args, { models }) => {
      try {
        const data = { ...args, status: 1 };
        const uid = data.id;
        await models.templates.update(data, {
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
    TemplateStatus: async (parent, { id, status }, { models }) => {
      try {
        const data = { status };
        await models.templates.update(data, { where: { id } });
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

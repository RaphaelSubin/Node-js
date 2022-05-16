import { UserInputError } from 'apollo-server';
import { Op } from 'sequelize';

export default {
  Query: {
    RoleList: async (parent, args, { models }) => {
      try {
        const condition = { [Op.not]: [{ status: 2 }] };
        const resp = await models.roles.findAll({
          where: condition,
          order: [['id', 'DESC']],
        });
        return resp;
      } catch (error) {
        throw new UserInputError(error);
      }
    },
    RoleOne: async (parent, { id }, { models }) => {
      try {
        const resp = await models.roles.findByPk(id);
        return resp;
      } catch (error) {
        throw new UserInputError(error);
      }
    },
  },

  Mutation: {
    addRole: async (parent, { userType }, { models }) => {
      try {
        const data = { userType, status: 1 };
        const insert = await models.roles.create(data);
        return insert;
      } catch (error) {
        throw new UserInputError(error);
      }
    },

    updateRole: async (parent, { userType, id }, { models }) => {
      try {
        const data = { userType };
        const update = await models.roles.update(data, { where: { id } });
        return update;
      } catch (error) {
        throw new UserInputError(error);
      }
    },
    RoleStatus: async (parent, { id, status }, { models }) => {
      try {
        const data = { status };
        const resp = await models.roles.update(data, { where: { id } });
        return resp;
      } catch (error) {
        throw new UserInputError(error);
      }
    },
  },
};

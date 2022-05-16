import { AuthenticationError, UserInputError } from 'apollo-server';
import respObj from '../../assets/lang/en.json';

const { commonAPI, authAPI } = respObj;
export default {
  Query: {
    getModule: async (parent, args, { models, me }) => {
      try {
        const { userType } = me;
        if (!me) {
          throw new AuthenticationError(authAPI.auth_failed);
        }
        const resp = await models.permission.findAll({
          where: { roleId: userType },
          include: [
            {
              model: models.module,
              as: 'module',
              include: [
                {
                  model: models.mainMenu,
                  as: 'mainMenu',
                },
              ],
            },
          ],
        });
        return resp;
      } catch (error) {
        throw new UserInputError(error);
      }
    },
    getModuleByuser: async (parent, roleId, { models }) => {
      try {
        const resp = await models.permission.findAll({
          include: [
            {
              model: models.module,
              as: 'module',
              include: [
                {
                  model: models.mainMenu,
                  as: 'mainMenu',
                },
              ],
            },
          ],
          where: roleId,
        });
        return resp;
      } catch (error) {
        throw new UserInputError(error);
      }
    },
  },
  Mutation: {
    addPermission: async (parent, args, { models }) => {
      try {
        const data = { ...args };
        const { roleId, moduleId } = data;
        await models.permission.destroy({
          where: { roleId },
        });
        moduleId.forEach(async (item) => {
          const datas = {
            roleId,
            moduleId: item,
          };
          await models.permission.create(datas);
        });
        const msg = {
          status: process.env.STATUS_SUCCESS,
          message: commonAPI.Sucess,
        };
        return msg;
      } catch (error) {
        throw new UserInputError(error);
      }
    },
  },
};

import { UserInputError } from 'apollo-server';
import { Op } from 'sequelize';
import { Sequelize } from 'sequelize';
import respObj from '../../assets/lang/en.json';
import {
  firebaseUpload,
  getPagination,
  getPagingData,
} from '../../utils/helpers';
const { authAPI } = respObj;
const Path = 'uploads/avatar/';
export default {
  Query: {
    CategoryList: async (parent, { size, page }, { models }) => {
      try {
        const condition = { [Op.not]: [{ status: 2 }] };
        const { limit, offset } = getPagination(page, size);
        const resp = await models.category.findAndCountAll({
          where: condition,
          order: [['id', 'DESC']],
          limit,
          offset,
        });
        const response = getPagingData(resp, page, limit);
        return response;
      } catch (error) {
        throw new UserInputError(error);
      }
    },
    CategoryOne: async (parent, { id }, { models }) => {
      try {
        const resp = await models.category.findByPk(id);
        return resp;
      } catch (error) {
        throw new UserInputError(error);
      }
    },
  },

  Mutation: {
    addCategory: async (parent, { name, avatar }, { models }) => {
      try {
        const data = {
          name,
          status: 1,
        };

        if (avatar) {
          const file = await firebaseUpload(avatar, Path);
          data.avatar = file.filename !== undefined ? file.filename : null;
        }
        const checkName = await models.category.findOne({
          where: { name, status: 1 },
        });
        if (checkName === null) {
          const insert = await models.category.create(data);
          return insert;
        }
        throw new UserInputError(authAPI.cat_exists);
      } catch (error) {
        throw new UserInputError(error);
      }
    },

    updateCategory: async (parent, { name, avatar, id }, { models }) => {
      let data;
      try {
        if (avatar) {
          data = { name, avatar, id };
          const file = await firebaseUpload(avatar, Path);
          data.avatar = file.filename !== undefined ? file.filename : null;
        } else {
          data = { name, id };
        }
        const update = await models.category.update(data, { where: { id } });
        return update;
      } catch (error) {
        throw new UserInputError(error);
      }
    },
    categoryStatus: async (parent, { id, status }, { models }) => {
      try {
        const data = { status };
        const resp = await models.category.update(data, { where: { id } });
        return resp;
      } catch (error) {
        throw new UserInputError(error);
      }
    },
  },
};

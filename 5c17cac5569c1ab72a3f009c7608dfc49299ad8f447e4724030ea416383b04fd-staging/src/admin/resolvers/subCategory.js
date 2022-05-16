import { UserInputError } from 'apollo-server';
import { Op } from 'sequelize';
import {
  firebaseUpload,
  getPagination,
  getPagingData,
} from '../../utils/helpers';
import respObj from '../../assets/lang/en.json';
const { authAPI } = respObj;
const Fpath = 'uploads/subCategory/';

export default {
  Query: {
    subCategoryList: async (parent, { size, page, catId }, { models }) => {
      try {
        const condition = { catId, [Op.not]: [{ status: 2 }] };
        const { limit, offset } = getPagination(page, size);
        const resp = await models.subCategory.findAndCountAll({
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
    subCategoryOne: async (parent, { id }, { models }) => {
      try {
        const resp = await models.subCategory.findByPk(id);
        return resp;
      } catch (error) {
        throw new UserInputError(error);
      }
    },
  },

  Mutation: {
    addSubCategory: async (
      parent,
      { subName, subImage, catId },
      { models }
    ) => {
      try {
        const data = {
          subName,
          catId,
          status: 1,
        };
        if (subImage) {
          const name = await firebaseUpload(subImage, Fpath);
          data.subImage = name.filename !== undefined ? name.filename : null;
        }
        const checkName = await models.subCategory.findOne({
          where: { subName, status: 1 },
        });
        if (checkName === null) {
          const insert = await models.subCategory.create(data);
          return insert;
        } else {
          throw new UserInputError(authAPI.cat_exists);
        }
      } catch (error) {
        throw new UserInputError(error);
      }
    },

    updateSubCategory: async (
      parent,
      { subName, subImage, catId, id },
      { models }
    ) => {
      let data;
      try {
        if (subImage) {
          data = {
            subName,
            catId,
            status: 1,
          };
          const name = await firebaseUpload(subImage, Fpath);
          data.subImage = name.filename !== undefined ? name.filename : null;
        } else {
          data = {
            subName,
            catId,
            status: 1,
          };
        }
        const update = await models.subCategory.update(data, { where: { id } });
        return update;
      } catch (error) {
        throw new UserInputError(error);
      }
    },
    SubCategoryStatus: async (parent, { id, status }, { models }) => {
      try {
        const data = { status };
        const resp = await models.subCategory.update(data, { where: { id } });
        return resp;
      } catch (error) {
        throw new UserInputError(error);
      }
    },
  },
};

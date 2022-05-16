import { UserInputError } from 'apollo-server';
import { Op } from 'sequelize';
import respObj from '../../assets/lang/en.json';
import {
  getPagination,
  getPagingData,
  generateCsv,
  uniqueId,
  fcDirectUpload,
} from '../../utils/helpers';

const sequelize = require('sequelize');

const { authAPI } = respObj;

const fileName = `travlersexport-${uniqueId()}.csv`;
export default {
  Query: {
    TravelersList: async (
      parent,
      { userType, keyword, size, page },
      { models }
    ) => {
      let condition;
      try {
        if (keyword) {
          condition = {
            userType,
            [Op.not]: [{ status: 2 }],
            [Op.or]: [
              { firstName: { [Op.iLike]: `%${keyword}%` } },
              { lastName: { [Op.iLike]: `%${keyword}%` } },
              { screenName: { [Op.iLike]: `%${keyword}%` } },
              { emailId: { [Op.iLike]: `%${keyword}%` } },
              { phone: { [Op.like]: `%${keyword}%` } },
              { country: { [Op.iLike]: `%${keyword}%` } },
              { state: { [Op.iLike]: `%${keyword}%` } },
            ],
          };
        } else {
          condition = {
            userType,
            [Op.not]: [{ status: 2 }],
          };
        }
        const { limit, offset } = getPagination(page, size);
        const resp = await models.travellers.findAndCountAll({
          where: condition,
          order: [['id', 'DESC']],
          attributes: {
            include: [
              [
                sequelize.fn('COUNT', sequelize.col('videos.id')),
                'videosCount',
              ],
            ],
          },
          include: [
            {
              model: models.videos,
              attributes: [],
              as: 'videos',
              duplicating: false,
            },
          ],
          raw: true,
          group: ['travellers.id'],
          limit,
          offset,
        });
        const totalItems = await models.travellers.count({
          where: condition,
          include: [
            {
              model: models.videos,
              as: 'videos',
              attributes: ['id'],
            },
          ],
        });
        const { rows: data } = resp;
        const currentPage = page ? +page : 0;
        const totalPages = Math.ceil(totalItems / limit);
        return {
          totalItems,
          data,
          totalPages,
          currentPage,
        };
      } catch (error) {
        throw new UserInputError(error);
      }
    },
    VideoList: async (parent, { keyword, size, page }, { models }) => {
      let condition;
      try {
        if (keyword) {
          condition = {
            [Op.not]: [{ status: 2 }],
            [Op.or]: [{ caption: { [Op.like]: `%${keyword}%` } }],
          };
        } else {
          condition = {
            [Op.not]: [{ status: 2 }],
          };
        }
        const { limit, offset } = getPagination(page, size);
        const resp = await models.videos.findAndCountAll({
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
    TravelerVideo: async (parent, { keyword, id, size, page }, { models }) => {
      let condition;
      try {
        if (keyword) {
          condition = {
            userId: id,
            [Op.not]: [{ status: 2 }],
            [Op.or]: [{ caption: { [Op.like]: `%${keyword}%` } }],
          };
        } else {
          condition = {
            userId: id,
            [Op.not]: [{ status: 2 }],
          };
        }
        const { limit, offset } = getPagination(page, size);
        const resp = await models.videos.findAndCountAll({
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
    TravelersOne: async (parent, { id }, { models }) => {
      try {
        const travelerProfile = await models.travellers.findByPk(id);
        const following = await models.followers.findAndCountAll({
          where: { status: 1, travellersId: id },
        });
        const followers = await models.followers.findAndCountAll({
          where: { status: 1, followersId: id },
        });
        const videos = await models.videos.findAndCountAll({
          where: { status: 1, userId: id },
        });
        const likes = await models.likes.findAndCountAll({
          where: { status: 1, travellersId: id },
        });
        const comments = await models.comments.findAndCountAll({
          where: { status: 1, travellersId: id },
        });
        const shareC = await models.videos.findAll({
          raw: true,
          attributes: [
            [sequelize.fn('SUM', sequelize.col('shareCount')), 'shareCount'],
          ],
        });
        const booking = await models.bookings.findAndCountAll({
          where: { status: 1, travellersId: id },
        });
        let userLevel = 0;
        const countdata = 6000;
        if (
          travelerProfile.viewcount > 5000 &&
          travelerProfile.sharecount > 5000 &&
          countdata > 5000
        ) {
          const view = Math.round(travelerProfile.viewcount / 5000);
          const share = Math.round(travelerProfile.sharecount / 5000);
          const follow = Math.round(followers.count / 5000);
          if (view < share && view < follow) {
            userLevel = view;
          } else if (share < follow) {
            userLevel = share;
          } else {
            userLevel = follow;
          }
        }
        const data = {
          travelerProfile,
          userLevel,
          followersCount: followers.count,
          followingCount: following.count,
          videosCount: videos.count,
          likeCount: likes.count,
          commentCount: comments.count,
          shareCount: shareC[0].shareCount,
          bookingCount: booking.count,
        };
        return data;
      } catch (error) {
        throw new UserInputError(error);
      }
    },
  },

  Mutation: {
    changeStatus: async (parent, { id, status }, { models }) => {
      try {
        const data = { status };
        const resp = await models.travellers.update(data, { where: { id } });
        return resp;
      } catch (error) {
        throw new UserInputError(error);
      }
    },
    TravelersExport: async (
      parent,
      { userType, fields, startDate, endDate },
      { models }
    ) => {
      let condition;
      try {
        if (startDate && endDate) {
          condition = {
            userType,
            [Op.and]: [
              sequelize.where(
                sequelize.fn('date', sequelize.col('createdAt')),
                '>=',
                startDate,
              ),
              sequelize.where(
                sequelize.fn('date', sequelize.col('createdAt')),
                '<=',
                endDate,
              ),
            ],

            [Op.not]: [{ status: 2 }],
          };
        } else {
          condition = {
            userType,
            [Op.not]: [{ status: 2 }],
          };
        }
        const resp = await models.travellers.findAll({
          attributes: fields,
          where: condition,
          raw: true,
        });
        if (resp.length === 0) {
          const msg = {
            fileName: authAPI.no_data,
          };
          return msg;
        }
        const csvFields = fields;
        await generateCsv(csvFields, resp, fileName);
        const path = `./${fileName}`;
        const file = await fcDirectUpload(path);
        const msg = {
          fileName: file.filename,
        };
        return msg;
      } catch (error) {
        throw new UserInputError(error);
      }
    },
    VideoStatus: async (parent, { id, status }, { models }) => {
      try {
        const data = { status };
        const resp = await models.videos.update(data, { where: { id } });
        return resp;
      } catch (error) {
        throw new UserInputError(error);
      }
    },
  },
};

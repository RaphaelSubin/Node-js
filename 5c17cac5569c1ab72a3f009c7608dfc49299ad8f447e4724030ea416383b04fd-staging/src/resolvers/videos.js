import { UserInputError } from 'apollo-server';
import fs from 'fs';
import { Op } from 'sequelize';
import FirebaseService from '../utils/firebase';
import { firebaseVideoUpload, getPagination, getPagingData } from '../utils/helpers';
import { lang } from '../utils/helpers';
var Sequelize = require('sequelize');

const path = 'uploads/videos/';
const COUNT = 1;
export default {
  Query: {

    nearByVideos: async (parent, { lat, lng, size, page }, { models, me, language }) => {
      if (!language) {
        language = '2';
      }
      let langData = lang(language);
      if (!me) {
          throw new UserInputError(
              langData.authAPI.auth_failed,
          );
      }
      const userCategory = await models.userCategory.findOne({
        where: { userId: me.id, status: 1 },
      });
      try {
        const condition = { status: 1, categoryId: userCategory.categoryId, [Op.not]: [{ userId: me.id }], isprivate: 1 };
        const { limit, offset } = getPagination(page, size);
        const resp = await models.videos.findAndCountAll({
          attributes: [ 'id','url','lat','lng','place','caption','commentCount','likeCount','viewCount','shareCount','status','createdAt','userId','categoryId','thumbnail', [Sequelize.literal(`3959 * acos(cos(radians(` + lat + `)) * cos(radians(lat)) * cos(radians(` + lng + `) - radians(lng)) + sin(radians(` + lat + `)) * sin(radians(lat)))`), 'distance']],

          include: [
            {
              model: models.travellers,
              as: 'travellers',
            },
            {
              model: models.likes,
              as: 'likes',
              required: false,
              where: { travellersId: me.id}
            },
          ],
          // having: sequelize.literal('distance < 20'),
          order: Sequelize.literal('distance ASC'),
          where: condition,
          limit,
          offset,
        });
        const response = getPagingData(resp, page, limit);
        return response;
      } catch (error) {
        throw new UserInputError(error);
      }
    },

    allVideos: async (parent, { lat, lng, size, page }, { models, me, language }) => {
      if (!language) {
        language = '2';
      }
      let langData = lang(language);
      if (!me) {
          throw new UserInputError(
              langData.authAPI.auth_failed,
          );
      }
      const userCategory = await models.userCategory.findOne({
        where: { userId: me.id, status: 1 },
      });
      try {
        const condition = { status: 1, categoryId: userCategory.categoryId, [Op.not]: [{ userId: me.id }], isprivate: 1 };
        const { limit, offset } = getPagination(page, size);
        const resp = await models.videos.findAndCountAll({
          include: [
            {
              model: models.travellers,
              as: 'travellers',
            },
            {
              model: models.likes,
              as: 'likes',
              required: false,
              where: { travellersId: me.id}
            },
          ],
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

    myFavVideos: async (parent, { size, page }, { models, me, language }) => {
      if (!language) {
        language = '2';
      }
      let langData = lang(language);
      if (!me) {
          throw new UserInputError(
              langData.authAPI.auth_failed,
          );
      }
      try {
        const condition = { status: 1 };
        const { limit, offset } = getPagination(page, size);
        const resp = await models.videos.findAndCountAll({
          include: [
            {
              model: models.travellers,
              as: 'travellers',
            },
            {
              model: models.likes,
              required: true,
              as: 'likes',
            },
          ],
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

    
    myVideos: async (parent, { size, page }, { models, me, language }) => {
      if (!language) {
        language = '2';
      }
      let langData = lang(language);
      if (!me) {
          throw new UserInputError(
              langData.authAPI.auth_failed,
          );
      }
      try {
        const condition = { status: 1, userId: me.id };
        const { limit, offset } = getPagination(page, size);
        const resp = await models.videos.findAndCountAll({
          include: [
            {
              model: models.travellers,
              as: 'travellers',
            },
            {
              model: models.category,
              as: 'category',
            },
            {
              model: models.likes,
              as: 'likes',
              required: false,
              where: { travellersId: me.id}
            },
          ],
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

    videoOne: async (parent, { videoId }, { models, me, language }) => {
      if (!language) {
        language = '2';
      }
      let langData = lang(language);
      if (!me) {
          throw new UserInputError(
              langData.authAPI.auth_failed,
          );
      }
      try {
        const condition = { status: 1 , id: videoId};
        const resp = await models.videos.findOne({
          include: [
            {
              model: models.travellers,
              as: 'travellers',
            },
            {
              model: models.likes,
              required: false,
              as: 'likes',
              where: { travellersId: me.id}
            },
          ],
          where: condition,
          order: [['id', 'DESC']],
        });
        return resp;
      } catch (error) {
        throw new UserInputError(error);
      }
    },

  },

  Mutation: {
    addVideo: async (
      parent,
      {
        categoryId, url, caption, lat, lng, place, isprivate, thumbnail
      },
      { models, me, language },
    ) => {
      if (!language) {
        language = '2';
      }
      let langData = lang(language);
      if (!me) {
          throw new UserInputError(
              langData.authAPI.auth_failed,
          );
      }
      const data = {
        categoryId,
        url,
        caption,
        thumbnail,
        userId: me.id,
        status: 1,
        lat,
        lng,
        isprivate,
        place,
      };
      
      /*if (url) {
        const name = await firebaseVideoUpload(url, path);
        data.url = name.filename !== undefined ? name.filename : null;
          await FirebaseService.uploadFile(name.thumbPath).then(async (resp) => {
            const obj = resp[1];
            const filename = `https://firebasestorage.googleapis.com/v0/b/cloudtrav.appspot.com/o/${obj.name}?alt=media&token=${obj.metadata.firebaseStorageDownloadTokens}`;
            fs.unlinkSync(name.thumbPath.path);
            data.thumbnail = filename;
          });
      }*/

      const video = await models.videos.create(data);
      if (video) {
        const update = await models.travellers.update({ userType: 2 }, { where: { id: me.id } });
        await models.travellers.increment({ point: COUNT }, { where: { id: me.id } });
        const msg = {
          status: langData.authAPI.success,
          code: langData.authAPI.codeSuccess,
          message: langData.messageAPI.videoSuccess,
        };
        return msg;
      }
      throw new UserInputError(
        langData.authAPI.error,
      );
    },

    changeVideoPrivacy: async (
      parent,
      {
        videoId, isprivate
      },
      { models, me, language },
    ) => {
      if (!language) {
        language = '2';
      }
      let langData = lang(language);
      if (!me) {
          throw new UserInputError(
              langData.authAPI.auth_failed,
          );
      }
      const changeVideoPrivacy = await models.videos.update({ isprivate : isprivate}, { where: { id: videoId, userId: me.id } });
      if (changeVideoPrivacy[0]===1) {
        const msg = {
          status: langData.authAPI.success,
          code: langData.authAPI.codeSuccess,
          message: langData.messageAPI.changeVideoPrivacy,
        };
        return msg;
      }
      const msg = {
        status: langData.authAPI.error,
        code: langData.authAPI.codeError,
        message: langData.messageAPI.changeVideoPrivacyFailed,
      };
      return msg;
    },

    deleteVideo: async (
      parent,
      {
        videoId
      },
      { models, me, language },
    ) => {
      if (!language) {
        language = '2';
      }
      let langData = lang(language);
      if (!me) {
          throw new UserInputError(
              langData.authAPI.auth_failed,
          );
      }
      const video = await models.videos.update({ status: 0 }, { where: { id: videoId, userId: me.id } });
      if (video[0]===1) {
        const msg = {
          status: langData.authAPI.success,
          code: langData.authAPI.codeSuccess,
          message: langData.messageAPI.videoDeletedSuccess,
        };
        return msg;
      }
      const msg = {
        status: langData.authAPI.error,
        code: langData.authAPI.codeError,
        message: langData.messageAPI.videoDeletedFailed,
      };
      return msg;
    },
  },

};

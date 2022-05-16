import { UserInputError } from "apollo-server";
import { getPagination, getPagingData } from "../utils/helpers";
import respObj from '../assets/lang/en.json';
// import { like } from "sequelize/types/lib/operators";
import { lang } from '../utils/helpers';
import FCM from 'fcm-node';
const { authAPI, messageAPI } = respObj;
const Op = require("sequelize").Op;
const COUNT = 1;

export default {
  Query: {
    allLikes: async (parent, { size, page, videoId }, { models }) => {
      try {
        const condition = { status: 1, videoId };
        const { limit, offset } = getPagination(page, size);
        const resp = await models.likes.findAndCountAll({
          include: [
            {
              model: models.travellers,
              as: 'traveller',
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
  },

  Mutation: {
    addLike: async (
      parent,
      {
        videoId,
      },
      { models, secret, me, language },
    ) => {
      if (!language) {
        language = '2';
      }
      let langData = lang(language);
      const checkLiked = await models.likes.findOne({ where: { travellersId: me.id, videoId: videoId } });
      if (checkLiked === null) {
        const likes = await models.likes.create({
          travellersId: me.id,
          videoId,
          status: 1
        });
        if (likes) {
          await models.videos.increment({ likeCount: COUNT }, { where: { id: videoId } });
          await models.travellers.increment({ point: COUNT }, { where: { id: me.id } });
          const video = await models.videos.findOne({ where: {id: videoId} });
          const notificationData = {
            sourceType: `Like`,
            content: `${me.screenName} liked your video`,
            videoId,
            userId: video.userId,
            notifiedUserId: me.id,
          };
          await models.notifications.create(notificationData);
          const msg = {
            status: langData.authAPI.success,
            code: langData.authAPI.codeSuccess,
            message: langData.messageAPI.likeSuccess,
          };
          const chLang = await models.travellers.findOne({ where: { id: video.userId } });
          let str = chLang.language.toString();
          let notiLangData = lang(str);
          const pushData = {
            fcmToken:chLang.fcmToken, 
            title: `${me.screenName}` + notiLangData.noti.likedVideo,
            click_action: 'FLUTTER_NOTIFICATION_CLICK',
            data: {videoId: videoId}
        };
          const pushPayload = { 
            to : pushData.fcmToken,
            notification: { 
                title : (pushData.title) ? pushData.title : process.env.SITE_TITLE, 
                body  : (pushData.title) ? pushData.title : '' ,
                click_action: 'FLUTTER_NOTIFICATION_CLICK',
            },
            data: pushData.data ? pushData.data : {}
        };
            const fcm = new FCM(process.env.FIREBASE_SERVER_KEY);
            fcm.send(pushPayload, function(err, response){
              if (err) {
                  console.log(langData.authAPI.error);
              } else {
                  console.log(langData.authAPI.success, response);
              }
          });
          return msg;
        }
        else {
          const msg = {
            status: langData.authAPI.error,
            code: langData.authAPI.codeError,
            message: langData.messageAPI.errorMsg,
          };
          return msg;
        }
      }
      else {
        throw new UserInputError(langData.authAPI.alreadyLiked);
      }
    },
    unLikeVideo: async (
      parent,
      {
        videoId,
      },
      { models, secret, me, language },
    ) => {
      if (!language) {
        language = '2';
      }
      let langData = lang(language);
      if (!me) {
        // eslint-disable-next-line no-undef
        throw new UserInputError(langData.authAPI.auth_failed);
      }
      const unLikes = await models.likes.destroy({
        where: { videoId: videoId, travellersId: me.id },
      });
      if (unLikes) {
        await models.videos.decrement({ likeCount: COUNT }, { where: { id: videoId } });
        await models.travellers.decrement({ point: COUNT }, { where: { id: me.id } });
        const msg = {
          status: langData.authAPI.success,
          code: langData.authAPI.codeSuccess,
          message: langData.messageAPI.unlikeSuccess,
        };
        return msg;
      }
      else {
        const msg = {
          status: langData.authAPI.error,
          code: langData.authAPI.codeError,
          message: langData.messageAPI.errorMsg,
        };
        return msg;
      }
    },
  }

};

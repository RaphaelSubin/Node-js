import { UserInputError } from "apollo-server";
import { getPagination, getPagingData } from "../utils/helpers";
import { lang } from '../utils/helpers';
import FCM from 'fcm-node';
const Op = require("sequelize").Op;
const COUNT = 1;

export default {
  Query: {
    allMainComments: async (parent, { size, page, videoId }, { models, me, language }) => {
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
        const condition = { status: 1, videoId, commentId: null   };
        const { limit, offset } = getPagination(page, size);
        const resp = await models.comments.findAndCountAll({
          include: [
            {
              model: models.travellers,
              required: false,
              as: 'traveller',
            },
            {
              model: models.commentLikes,
              required: false,
              as: 'commentLikes',
              where: { travellersId: me.id, status: 1}
            },
          ],
          where: condition,
          order: [['id', 'DESC']],
          limit,
          offset,
        });
        const reply= await models.comments.findAndCountAll({
          include: [
            {
              model: models.travellers,
              required: false,
              as: 'traveller',
            },
            {
              model: models.commentLikes,
              required: false,
              as: 'commentLikes',
              where: { travellersId: me.id, status: 1}
            },
          ],
          where: { status: 1, videoId, [Op.not]: [{ commentId: null }] },
          order: [['id', 'DESC']]
        });
        let replies = new Array;
        resp.rows.forEach(function (comment, j ) {
          replies = replies.slice(j);
          if (comment.commentId === null ) {
            comment.id;
            comment = comment;
              if (comment.replyCount===0) {
                replies= [];
                comment.replies = replies;
              }
              else{
                replies = replies.slice(j);
                for (var i=0; i< reply.count; i++){
                  if(reply.rows[i].commentId===comment.id){
                    replies.push(reply.rows[i]);
                    comment.replies = replies;
                  }
                }
              }
          }
        });
        const response = getPagingData(resp, page, limit);
        return response;
      } catch (error) {
        throw new UserInputError(error);
      }
    },
    replyComments: async (parent, { size, page, videoId, commentId }, { models, me, language }) => {
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
        const condition = { status: 1, videoId, commentId };
        const { limit, offset } = getPagination(page, size);
        const resp = await models.comments.findAndCountAll({
          include: [
            {
              model: models.travellers,
              required: false,
              as: 'traveller',
            },
            {
              model: models.commentLikes,
              required: false,
              as: 'commentLikes',
              where: { travellersId: me.id, status: 1}
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
    addComment: async (
      parent,
      {
        comment, videoId, commentId,
      },
      { models, me, language },
    ) => {
      if (!language) {
        language = '2';
      }
      let langData = lang(language);
      if (!me) {
        // eslint-disable-next-line no-undef
        throw new UserInputError(langData.authAPI.auth_failed);
      }
      const comments = await models.comments.create({
        comment,
        travellersId: me.id,
        videoId,
        commentId,
        status: 1,
      });
      if (comments) {
        const video = await models.videos.findOne({ where: { id: videoId } });
        await models.videos.increment({ commentCount: COUNT }, { where: { id: videoId } });
        await models.travellers.increment({ point: COUNT }, { where: { id: me.id } });
        if(commentId){
          await models.comments.increment({ replyCount: COUNT }, { where: { id: commentId } });
        }
        const notificationData = {
          sourceType: 'Commented',
          content: `${me.screenName} commented on your video`,
          videoId,
          userId: video.userId,
          notifiedUserId: me.id,
        };
        await models.notifications.create(notificationData);
        const msg = {
          id: comments.id,
          comment: comments.comment,
          travellersId: comments.travellersId,
          videoId: comments.videoId,
          commentId: comments.commentId,
          status: langData.authAPI.success,
          code: langData.authAPI.codeSuccess,
          message: langData.messageAPI.commentSuccess,
        };
        const chLang = await models.travellers.findOne({ where: { id: video.userId } });
          let str = chLang.language.toString();
          let notiLangData = lang(str);
          const pushData = {
            fcmToken: chLang.fcmToken, 
            title: `${me.screenName}` + notiLangData.noti.addComment,
            click_action: 'FLUTTER_NOTIFICATION_CLICK',
            data: {travellersId: video.userId}
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
    },

    likeComment: async (
      parent,
      {
        commentId
      },
      { models, me, language },
    ) => {
      if (!language) {
        language = '2';
      }
      let langData = lang(language);
      if (!me) {
        // eslint-disable-next-line no-undef
        throw new UserInputError(langData.authAPI.auth_failed);
      }
      const checkLiked = await models.commentLikes.findOne({ where: { travellersId: me.id, commentId } });
      if(checkLiked === null){

      const likes = await models.commentLikes.create({
        travellersId: me.id,
        commentId,
      });
      if (likes) {
        await models.comments.increment({ likeCount: COUNT }, { where: { id: commentId } });
        const comment = await models.comments.findOne({ where: { id: commentId } });
        const notificationData = {
          sourceType: `Liked`,
          content: `${me.screenName} liked your comment`,
          userId: comment.travellersId,
          notifiedUserId: me.id,
        };
        await models.notifications.create(notificationData);
        const chLang = await models.travellers.findOne({ where: { id: comment.travellersId} });
          let str = chLang.language.toString();
          let notiLangData = lang(str);
          const pushData = {
            fcmToken: chLang.fcmToken, 
            title: `${me.screenName}` + notiLangData.noti.likedComment,
            click_action: 'FLUTTER_NOTIFICATION_CLICK',
            data: {travellersId: comment.travellersId, commentId}
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
        const msg = {
          status: langData.authAPI.success,
          code: langData.authAPI.codeSuccess,
          message: langData.messageAPI.likeSuccess,
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
      }
      else {
        throw new UserInputError(langData.authAPI.alreadyLiked);
      }

    },

    unlikeComment: async (
      parent,
      {
        commentId
      },
      { models, me, language },
    ) => {
      if (!language) {
        language = '2';
      }
      let langData = lang(language);
      if (!me) {
        // eslint-disable-next-line no-undef
        throw new UserInputError(langData.authAPI.auth_failed);
      }
      const unLikes = await models.commentLikes.destroy({
        where: { commentId, travellersId: me.id },
      });
      if (unLikes) {
        await models.comments.decrement({ likeCount: COUNT }, { where: { id: commentId } });
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

    deleteComment: async (parent, { status, commentId }, { models, language }) => {
      if (!language) {
        language = '2';
      }
      let langData = lang(language);
      const postData = {
        status
      };
      const deleteComment = await models.comments.update(postData, { where: { id: commentId } });
      if (deleteComment) {
        const comments = await models.comments.findOne({ where: { id: commentId } });
        await models.videos.decrement({ commentCount: COUNT }, { where: { id: comments.videoId } });
        await models.comments.decrement({ replyCount: COUNT }, { where: { id: comments.commentId } });
        const msg = {
          status: langData.authAPI.success,
          code: langData.authAPI.codeSuccess,
          message: langData.commonAPI.deleted,
        };
        return msg;
      }
    },

  },
}

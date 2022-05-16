/* eslint-disable linebreak-style */
/* eslint-disable no-undef */
/* eslint-disable operator-linebreak */
/* eslint-disable no-else-return */
/* eslint-disable linebreak-style */
/* eslint-disable import/named */
/* eslint-disable prefer-const */
/* eslint-disable no-param-reassign */
/* eslint-disable comma-dangle */
/* eslint-disable linebreak-style */
import { UserInputError } from 'apollo-server';
import { lang } from '../utils/helpers';
import respObj from '../assets/lang/en.json';

const COUNT = 1;
const { messageAPI, authAPI } = respObj;

export default {
  Mutation: {
    addWatchTime: async (
      parent,
      { videoId, watchtime },
      { models, me, language }
    ) => {
      if (!language) {
        language = '2';
      }
      let langData = lang(language);
      if (!me) {
        throw new UserInputError(langData.authAPI.auth_failed);
      }
      const postData = { watchtime };
      const video = await models.videos.findOne({ where: { id: videoId } });
      if (video) {
        await models.videos.increment(postData, { where: { id: videoId } });
        await models.travellers.increment(postData, {
          where: { id: video.userId },
        });
        const msg = {
          status: langData.authAPI.success,
          code: langData.authAPI.codeSuccess,
          message: langData.commonAPI.Update,
        };
        return msg;
      } else {
        const msg = {
          status: langData.authAPI.error,
          code: langData.authAPI.codeError,
          message: langData.messageAPI.errorMsg,
        };
        return msg;
      }
    },
    addShareCount: async (parent, { videoId }, { models, me, language }) => {
      if (!language) {
        language = '2';
      }
      let langData = lang(language);
      if (!me) {
        throw new UserInputError(authAPI.auth_failed);
      }
      const video = await models.videos.findOne({ where: { id: videoId } });
      if (video) {
        const followers = await models.followers.findAndCountAll({
          where: { status: 1, travellersId: video.userId },
        });
        let userLevel = 0;
        const profile = await models.travellers.findByPk(video.userId);
        const userWallet = await models.userWallet.findAndCountAll({
          where: { travellersId: video.userId },
          limit: 1,
          order: [['id', 'DESC']],
        });
        if (
          profile.viewcount > 5000 &&
          profile.sharecount > 5000 &&
          followers.count > 5000
        ) {
          const view = Math.round(profile.viewcount / 5000);
          const share = Math.round(profile.sharecount / 5000);
          const follow = Math.round(followers.count / 5000);
          if (view < share && view < follow) {
            userLevel = view;
          } else if (share < follow) {
            userLevel = share;
          } else {
            userLevel = follow;
          }
        }
        if (profile.userlevel < userLevel) {
          let updateData = {
            name: messageAPI.levelUp,
            description: messageAPI.levelUpDesc,
            userRewards: 100,
            travellersId: video.userId,
          };
          let totAmt = userWallet.rows[0].totalAmount + updateData.userRewards;
          await models.userRewards.create(updateData);
          await models.travellers.update(
            { userlevel: userLevel },
            { where: { id: video.userId } }
          );
          await models.userLevel.create({
            travellersId: video.userId,
            status: 1,
          });
          await models.userWallet.create({
            description: updateData.name,
            amount: 100,
            totalAmount: totAmt,
            travellersId: video.userId,
          });
          const rewardData = {
            sourceType: updateData.name,
            content: updateData.description,
            notifiedUserId: video.userId,
          };
          await models.notifications.create(rewardData);
        }
        await models.videos.increment(
          { shareCount: COUNT },
          { where: { id: videoId } }
        );
        await models.travellers.increment(
          { sharecount: COUNT },
          { where: { id: video.userId } }
        );
        await models.travellers.increment(
          { point: COUNT },
          { where: { id: me.id } }
        );
        const msg = {
          status: langData.authAPI.success,
          code: langData.authAPI.codeSuccess,
          message: langData.commonAPI.Update,
        };
        return msg;
      } else {
        const msg = {
          status: langData.authAPI.error,
          code: langData.authAPI.codeError,
          message: langData.messageAPI.errorMsg,
        };
        return msg;
      }
    },
    addviewCount: async (parent, { videoId }, { models, me, language }) => {
      if (!language) {
        language = '2';
      }
      let langData = lang(language);
      if (!me) {
        throw new UserInputError(authAPI.auth_failed);
      }
      const video = await models.videos.findOne({ where: { id: videoId } });
      if (video) {
        const followers = await models.followers.findAndCountAll({
          where: { status: 1, travellersId: video.userId },
        });
        const userWallet = await models.userWallet.findAndCountAll({
          where: { travellersId: video.userId },
          limit: 1,
          order: [['id', 'DESC']],
        });
        let userLevel = 0;
        const profile = await models.travellers.findByPk(video.userId);
        if (
          profile.viewcount > 5000 &&
          profile.sharecount > 5000 &&
          followers.count > 5000
        ) {
          const view = Math.round(profile.viewcount / 5000);
          const share = Math.round(profile.sharecount / 5000);
          const follow = Math.round(followers.count / 5000);
          if (view < share && view < follow) {
            userLevel = view;
          } else if (share < follow) {
            userLevel = share;
          } else {
            userLevel = follow;
          }
        }
        if (profile.userlevel < userLevel) {
          let updateData = {
            name: messageAPI.levelUp,
            description: messageAPI.levelUpDesc,
            userRewards: 100,
            travellersId: video.userId,
          };
          let totAmt = userWallet.rows[0].totalAmount + updateData.userRewards;
          await models.userRewards.create(updateData);
          await models.travellers.update(
            { userlevel: userLevel },
            { where: { id: video.userId } }
          );
          await models.userLevel.create({
            travellersId: video.userId,
            status: 1,
          });
          await models.userWallet.create({
            description: updateData.name,
            amount: 100,
            totalAmount: totAmt,
            travellersId: video.userId,
          });
          const rewardData = {
            sourceType: updateData.name,
            content: updateData.description,
            notifiedUserId: travellersId,
          };
          await models.notifications.create(rewardData);
        }
        await models.videos.increment(
          { viewCount: COUNT },
          { where: { id: videoId } }
        );
        await models.travellers.increment(
          { viewcount },
          { where: { id: video.userId } }
        );
        // await models.travellers.increment({ point: COUNT }, { where: { id: me.id } });
        const msg = {
          status: langData.authAPI.success,
          code: langData.authAPI.codeSuccess,
          message: langData.commonAPI.Update,
        };
        return msg;
      }
      const msg = {
        status: langData.authAPI.error,
        code: langData.authAPI.codeError,
        message: langData.messageAPI.errorMsg,
      };
      return msg;
    },
    Videoanalytics: async (parent, args, { models, me, language }) => {
      if (!language) {
        language = '2';
      }
      let langData = lang(language);
      if (!me) {
        throw new UserInputError(authAPI.auth_failed);
      }
      try {
        const data = { ...args, status: 1 };
        await models.videosAnalytics.create(data);

        const msg = {
          status: langData.authAPI.success,
          code: langData.authAPI.codeSuccess,
          message: langData.commonAPI.Update,
        };
        return msg;
      } catch (error) {
        throw new UserInputError(error);
      }
    },
    Adsanalytics: async (parent, args, { models, me, language }) => {
      if (!language) {
        language = '2';
      }
      let langData = lang(language);
      if (!me) {
        throw new UserInputError(authAPI.auth_failed);
      }
      try {
        const data = { ...args, status: 1 };
        await models.adsAnalytics.create(data);

        const msg = {
          status: langData.authAPI.success,
          code: langData.authAPI.codeSuccess,
          message: langData.commonAPI.Update,
        };
        return msg;
      } catch (error) {
        throw new UserInputError(error);
      }
    },
  },
};

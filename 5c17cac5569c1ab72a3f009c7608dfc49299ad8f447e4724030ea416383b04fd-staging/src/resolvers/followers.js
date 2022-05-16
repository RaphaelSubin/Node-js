import { UserInputError } from 'apollo-server';
import { Op } from 'sequelize';
import { firebaseUpload, getPagination, getPagingData } from '../utils/helpers';
import respObj from '../assets/lang/en.json';
import { lang } from '../utils/helpers';
import FCM from 'fcm-node';
import userLevel from './userLevel';
const { authAPI,messageAPI  } = respObj;

const path = 'uploads/videos/';
const COUNT = 1;
export default {
  Query: {
    myFollowers: async (parent, { size, page }, { models, me, language }) => {
      if (!language) {
        language = '2';
      }
      let langData = lang(language);
      if (!me) {
        // eslint-disable-next-line no-undef
        throw new UserInputError(langData.authAPI.auth_failed);
      }
      try {
        const condition = { status: 1, travellersId: me.id };
        const { limit, offset } = getPagination(page, size);
        const resp = await models.followers.findAndCountAll({
          include: [
            {
              model: models.travellers,
              as: 'follower',
            },
            {
                model: models.travellers,
                as: 'travellers',
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

    myFollowing: async (parent, { size, page }, { models, me }) => {
      if (!language) {
        language = '2';
      }
      let langData = lang(language);
      if (!me) {
        // eslint-disable-next-line no-undef
        throw new UserInputError(langData.authAPI.auth_failed);
      }
      try {
        const condition = { status: 1, followersId: me.id  };
        const { limit, offset } = getPagination(page, size);
        const resp = await models.followers.findAndCountAll({
            include: [
                {
                  model: models.travellers,
                  as: 'follower',
                },
                {
                    model: models.travellers,
                    as: 'travellers',
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
    follow: async (
      parent,
      {
        travellersId,
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
      const data = {
        followersId: me.id,
        travellersId,
        status: 1,
      };

      const follow = await models.followers.create(data);
      if (follow) {
        const userWallet = await models.userWallet.findAndCountAll({ where: { travellersId: travellersId }, limit:1,
          order: [['id', 'DESC']] });
        const followers = await models.followers.findAndCountAll({
          where: { status: 1, travellersId: travellersId }
        });
        const profile = await models.travellers.findByPk(travellersId);
        let userLevel=0;
        if (profile.viewcount > 5000 && profile.sharecount > 5000 && followers.count > 5000) {
          const view = Math.round(profile.viewcount / 5000);
          const share = Math.round(profile.sharecount / 5000);
          const follow = Math.round(followers.count / 5000);
          if (view < share && view < follow) {
            userLevel = view;
          }
          else if (share < follow) {
            userLevel = share;
          }
          else {
            userLevel = follow;
          }
  
        }
        if(profile.userlevel < userLevel){
          let updateData = {
            name : messageAPI.levelUp ,
            description: messageAPI.levelUpDesc,
            userRewards: 100,
            travellersId
          }
          let totAmt= userWallet.rows[0].totalAmount+updateData.userRewards;
          await models.userRewards.create(updateData);
          await models.travellers.update({userlevel: userLevel}, { where: { id: travellersId } });
          await models.userLevel.create({ travellersId: travellersId, status: 1 });
          await models.userWallet.create({ description: updateData.name, amount:100,totalAmount: totAmt, travellersId: travellersId });
          const rewardData = {
            sourceType: updateData.name,
            content: updateData.description,
            notifiedUserId: travellersId,
          };

          await models.notifications.create(rewardData);
        }
        const notificationData = {
          sourceType: `Following`,
          content: `${me.screenName} started following you`,
          userId: travellersId,
          notifiedUserId: me.id,
        };
        await models.notifications.create(notificationData);
        const msg = {
            status: langData.authAPI.success,
            code: langData.authAPI.codeSuccess,
            message: langData.messageAPI.followSuccess,
        };
        const chLang = await models.travellers.findOne({ where: { id: data.travellersId } });
          let str = chLang.language.toString();
          let notiLangData = lang(str);
          const pushData = {
            fcmToken:chLang.fcmToken, 
            title: `${me.screenName}` + notiLangData.noti.followYou,
            click_action: 'FLUTTER_NOTIFICATION_CLICK',
            data: {travellersId: travellersId}
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
      throw new UserInputError(langData.authAPI.error);
    },
  },

};

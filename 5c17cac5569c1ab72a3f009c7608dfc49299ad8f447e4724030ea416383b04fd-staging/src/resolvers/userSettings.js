import { AuthenticationError, UserInputError } from 'apollo-server';
import { lang } from '../utils/helpers';

export default {
    Query: {
        ggetNotiSettingDetails: async (parent, args, { models,me,language }) => {
          if (!language) {
              language = '2';
          }
          let langData = lang(language);
          const notifications = await models.userSettings.findOne({ where: { travellersId: me.id } });
          if (notifications) {
            return notifications;
          }
          else{
            throw new UserInputError(langData.authAPI.error);
          }
        },
    },
    
    Mutation: {
        createNotification: async (
            parent,
            {
                notificationSound, notificationTone, notificationVibrate, callTone, callVibrate
            },
            { models, secret, me, language },
        ) => {
            if (!language) {
                language = '2';
            }
            let langData = lang(language);
            if (!me) {
                throw new AuthenticationError(
                    langData.authAPI.auth_failed,
                );
            }
            const userSettings = await models.userSettings.create({
                notificationSound,
                notificationTone,
                notificationVibrate,
                callTone,
                callVibrate,
                travellersId: me.id,
                status: 1,
            });
            if (userSettings) {
                const msg = {
                    status: langData.authAPI.success,
                    code: langData.authAPI.codeSuccess,
                    message: langData.messageAPI.notificationSettingsadded
                };
                return msg;
            }
            else{
                throw new UserInputError(error);
            }
            
        },

    updateNotification: async (parent, { notificationSound, notificationTone, notificationVibrate, callTone, callVibrate }, { models,me, language }) => {
        if (!language) {
            language = '2';
        }
        let langData = lang(language);
        if (!me) {
            throw new AuthenticationError(
                langData.authAPI.auth_failed,
            );
        }
      const postData = {
        notificationSound, notificationTone, notificationVibrate, callTone, callVibrate
      };
      const updateNotification = await models.userSettings.update(postData, { where: { travellersId: me.id } });
      if (updateNotification) {
        const msg = {
            status: langData.authAPI.success,
            code: langData.authAPI.codeSuccess,
            message: langData.commonAPI.Update
        };
        return msg;
      }
    },


   
  },
};

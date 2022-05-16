import travellers from "./travellers";
var pg = require('pg');
import { UserInputError } from "apollo-server";
import { lang } from '../utils/helpers';

export default {
    Query: {
        getNotificationList: async (parent, args, { models, me, language }) => {
            if (!language) {
                language = '2';
              }
              let langData = lang(language);
              if (!me) {
                // eslint-disable-next-line no-undef
                throw new UserInputError(langData.authAPI.auth_failed);
              }
            const resp = await models.notifications.findAll({
                include: [
                    {
                        model: models.travellers,
                        as: 'to',
                    },
                    {
                        model: models.travellers,
                        as: 'from',
                    },
                    {
                        model: models.templates,
                        as: 'templates',
                    },
                ],
                where: { status: 1, userId: me.id },
                order: [['id', 'DESC']],
            });
            return resp;
        },
        getNotificationDetails: async (parent, {id}, { models, me, language }) => {
            if (!language) {
                language = '2';
              }
              let langData = lang(language);
              if (!me) {
                // eslint-disable-next-line no-undef
                throw new UserInputError(langData.authAPI.auth_failed);
              }
            const resp = await models.notifications.findAll({
                include: [
                    {
                        model: models.travellers,
                        as: 'to',
                    },
                    {
                        model: models.travellers,
                        as: 'from',
                    },
                    {
                        model: models.templates,
                        as: 'templates',
                    },
                ],
                where: { status: 1, userId: me.id , id: id},
                order: [['id', 'DESC']],
            });
            return resp;
        },
        unreadNotification: async (parent, args, { models, me }) => {
            // eslint-disable-next-line max-len
            const readStatus = await models.notifications.findAll({
              include: [
                {
                    model: models.templates,
                    as: 'templates',
                },
                {
                  model: models.travellers,
                  as: 'to',
                  raw: true,
                },
                {
                  model: models.travellers,
                  as: 'from',
                  raw: true,
                },
              ],
              where: { read: 0, userId: me.id },
            });
            const data = { totalCount: readStatus.length, notifications: readStatus };
            return data;
          },
    },
    Mutation: {
        readNotification: async (parent, { id }, { models }) => {
          const data = { read: 1 };
          const readStatus = await models.notifications.update(data, { where: { id } });
          return readStatus;
        },
      },

};
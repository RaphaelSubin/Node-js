import travellers from "./travellers";
var pg = require('pg');
import respObj from '../assets/lang/en.json';
const { authAPI } = respObj;
export default {
    Query: {
        getTemplates: async (parent, args, { models }) => {
            const resp = await models.templates.findAll({
                where: {status: 1}
            });
            return resp;
        },
    },

    Mutation: {
        broadcastNotification: async (
            parent,
            {
                sourceType,
                type,
                content,
                templateId,
                userType,
            },
            { models, secret },
        ) => {
            let resp='';
            if(userType===0){
                 resp = await models.travellers.findAll({
                    where: { status: 1 }
                });
            }
            else{
                resp = await models.travellers.findAll({
                    where: {status: 1, userType: userType}
                });
            }
            let bulkData = [];
            resp.forEach((respData) => {
                 const notifications = {
                sourceType,
                type,
                content,
                templateId,
                userId: respData.id
            }
            bulkData.push(notifications);
            });
            await models.notifications.bulkCreate(bulkData);
             const msg = {
                status: authAPI.success,
                code: authAPI.codeSuccess,
                message: authAPI.notificationSend,
            };
            return msg;
        },

    },

};
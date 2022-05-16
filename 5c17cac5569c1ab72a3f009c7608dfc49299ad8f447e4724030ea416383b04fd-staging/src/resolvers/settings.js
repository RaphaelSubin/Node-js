import { lang } from '../utils/helpers';

export default {
    Query: {
        getSettings: async (parent, args, { models }) => {
            const id= 1;
            const resp = await models.settings.findByPk(id);
            return resp;
        },
    },

    Mutation: {

        updateSettingData: async (parent, { id,name, smtpHost,smtpUser,smtpPassword,smtpPort,adminEmail,logo
        }, { models, language }) => {
            if (!language) {
                language = '2';
            }
            let langData = lang(language);
            const postData = {
                name,
                smtpHost,
                smtpUser,
                smtpPassword,
                smtpPort,
                adminEmail,
                logo
            };
            const updateSettings = await models.settings.update(postData, { where: { id: id } });
            if (updateSettings) {
                const msg = {
                    status: langData.authAPI.success,
                    code: langData.authAPI.codeSuccess,
                    message: langData.messageAPI.updatedSettings,
                };
                return msg;
            }
        },

    },
};
import { AuthenticationError, UserInputError } from 'apollo-server';
import { getPagination } from '../utils/helpers';
import { lang } from '../utils/helpers';


export default {
    Query: {
        getLevelDetails: async (parent, { size, page }, { models, me, language }) => {
            if (!language) {
                language = '2';
            }
            let langData = lang(language);
            if (!me) {
                throw new AuthenticationError(
                    langData.authAPI.auth_failed,
                );
            }
            const { limit, offset } = getPagination(page, size);
            const levelDetails = await models.userLevel.findAndCountAll(
                {
                    where: { travellersId: me.id },
                    limit,
                    offset,
                    order: [['id', 'DESC']],
                }
            );
            return levelDetails.rows;
        },

        getRewardDetails: async (parent, { size, page }, { models, me, language }) => {
            if (!language) {
                language = '2';
            }
            let langData = lang(language);
            if (!me) {
                throw new AuthenticationError(
                    langData.authAPI.auth_failed,
                );
            }
            const { limit, offset } = getPagination(page, size);
            const levelDetails = await models.userRewards.findAndCountAll(
                {
                    where: { travellersId: me.id },
                    limit,
                    offset,
                    order: [['id', 'DESC']],
                }
            );
            return levelDetails.rows;
        },
    },
};

import { AuthenticationError, UserInputError } from 'apollo-server';
import { getPagination } from '../utils/helpers';
import { lang } from '../utils/helpers';


export default {
    Query: {
        getWalletDetails: async (parent, { size, page }, { models, me, language }) => {
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
            //   const userDetails = await models.travellers.findOne({ where :{id: me.id} });
            const walletDetails = await models.userWallet.findAndCountAll(
                {
                    where: { travellersId: me.id },
                    limit,
                    offset,
                    order: [['id', 'DESC']],
                }
            );
            return walletDetails.rows;
        },
    },
};

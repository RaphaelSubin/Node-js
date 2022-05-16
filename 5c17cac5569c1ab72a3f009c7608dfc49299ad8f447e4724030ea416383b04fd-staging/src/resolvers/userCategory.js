
import { UserInputError } from "apollo-server";
import { lang } from '../utils/helpers';

export default {
  Mutation: {
    addUserCategory: async (parent, { categoryId,subCategoryId }, { models, me, language }) => {
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
        const data = {
          categoryId,
          subCategoryId,
          userId: me.id,
          status: 1,
        };
        const insert = await models.userCategory.create(data);
        if(insert){
            const msg = {
              status: langData.authAPI.success,
              code: langData.authAPI.codeSuccess,
              message: langData.messageAPI.addedCat,
            };
            return msg; 
        }
      } catch (error) {
        throw new UserInputError(error);
      }
    },

    updateUserCategory: async (parent, { categoryId,subCategoryId }, { models, me, language }) => {
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
        const data = {
          categoryId,
          subCategoryId,
          userId: me.id,
          status: 1,
        };

        const updateUserCategory = await models.userCategory.update(data, { where: { userId: me.id } });
        if(updateUserCategory){
            const msg = {
              status: langData.authAPI.success,
              code: langData.authAPI.codeSuccess,
              message: langData.messageAPI.updateCat,
            };
            return msg; 
        }
      } catch (error) {
        throw new UserInputError(error);
      }
    }
    
  },
};

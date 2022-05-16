import jwt from 'jsonwebtoken';
import { AuthenticationError, UserInputError } from 'apollo-server';
import Email from '../utils/Email';
import { lang } from '../utils/helpers';

const em = new Email();
const createToken = async (traveller, secret, expiresIn) => {
  const {
    id, emailId, screenName, userType, refreshToken, categoryId
  } = traveller;
  const jwtToken = await jwt.sign({
    id, emailId, screenName, userType, refreshToken, categoryId
  }, secret, {
    expiresIn,
  });
  return jwtToken;
};

export default {
  Query: {
    travellers: async (parent, args, { models, me, language }) => {
      if (!language) {
        language = '2';
      }
      let langData = lang(language);
      if (!me) {
        throw new AuthenticationError(
          langData.authAPI.auth_failed,
        );
      }
      const resp = await models.travellers.findAll();
      return resp;
    },
    travellerOne: async (parent, { id }, { models, me, language }) => {
      if (!language) {
        language = '2';
      }
      let langData = lang(language);

      if (!me) {
        throw new AuthenticationError(
          langData.authAPI.auth_failed,
        );
      }
      const profile = await models.travellers.findByPk(id);
      const followers = await models.followers.findAndCountAll({
        where: { status: 1, travellersId: id }
      });
      const following = await models.followers.findAndCountAll({
        where: { status: 1, followersId: id }
      });
      const videos = await models.videos.findAndCountAll({
        include: [
          {
            model: models.likes,
            as: 'likes',
            required: false,
            where: { travellersId: me.id }
          },
        ],
        where: { status: 1, userId: id },

      });
      let userLevel = 0;
      const countdata = followers.count;
      if (profile.viewcount > 5000 && profile.sharecount > 5000 && countdata > 5000) {
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
      const data = {
        profile,
        userLevel: userLevel,
        followers: followers.count,
        following: following.count,
        videos: videos.rows
      }
      return data;
    },
    travellerMe: async (parent, args, { models, me, language }) => {
      if (!language) {
        language = '2';
      }
      let langData = lang(language);
      if (!me) {
        throw new AuthenticationError(
          langData.authAPI.auth_failed,
        );
      }
      const resp = await models.travellers.findByPk(me.id);
      return resp;
    },
    getTravellersProfile: async (parent, args, { models, me, language }) => {
      if (!language) {
        language = '2';
      }
      let langData = lang(language);
      if (!me) {
        throw new AuthenticationError(
          langData.authAPI.auth_failed,
        );
      }
      const resp = await models.travellers.findByPk(me.id);
      return resp;
    },
    findEmail: async (parent, { emailId }, { models, language }) => {
      if (!language) {
        language = '2';
      }
      let langData = lang(language);
      const checkEmail = await models.travellers.findOne({ where: { emailId: emailId } });
      if (checkEmail) {
        const msg = {
          status: langData.authAPI.success,
          code: langData.authAPI.codeSuccess,
          message: langData.authAPI.email_exists,
        };
        return msg;
      }
      else {
        const msg = {
          status: langData.authAPI.error,
          code: langData.authAPI.codeError,
          message: langData.authAPI.email_no_exists,
        };
        return msg;
      }
    },
    isAvailableScreenName: async (parent, { screenName }, { models, language }) => {
      if (!language) {
        language = '2';
      }
      let langData = lang(language);
      const checkscreenName = await models.travellers.findOne({ where: { screenName: screenName } });
      if (checkscreenName) {
        const msg = {
          status: langData.authAPI.error,
          code: langData.authAPI.codeError,
          message: langData.authAPI.screenName_exists,
        };
        return msg;
      }
      else {
        const msg = {
          status: langData.authAPI.success,
          code: langData.authAPI.codeSuccess,
          message: langData.authAPI.screenName_no_exists,
        };
        return msg;
      }
    },
  },

  Mutation: {
    travellerSignUp: async (
      parent,
      {
        firstName, lastName, emailId, countryCode, phone, gender, dob, UUID
      },
      { models, secret },
    ) => {
      const travellers = await models.travellers.create({
        firstName,
        lastName,
        emailId,
        refreshToken: UUID,
        screenName: firstName + ' ' + lastName,
        countryCode,
        phone,
        gender,
        dob,
        userType: 1,
        status: 1,
      });
      await models.userSettings.create({ travellersId: travellers.id, status: 1 });
      await models.userLevel.create({ travellersId: travellers.id, status: 1 });
      return { token: createToken(travellers, secret, '12d'), travellers: travellers };
    },

    travellerSignIn: async (
      parent,
      { UUID },
      { models, secret, language },
    ) => {
      if (!language) {
        language = '2';
      }
      let langData = lang(language);
      let refreshToken = UUID;
      const travellers = await models.travellers.findByLogin(refreshToken);
      if (!travellers) {
        throw new UserInputError(langData.authAPI.email_no_exists);
      }
      const category = await models.userCategory.findOne({
        where: { status: 1, userId: travellers.id },
      });
      let categoryId = null;
      if (category) {
        categoryId = category.categoryId
      }
      const userSettings = await models.userSettings.findOne({
        where: { status: 1, travellersId: travellers.id },
      });
      if(!userSettings){
        await models.userSettings.create({ travellersId: travellers.id, status: 1 });
      }
      const userLevel = await models.userLevel.findOne({
        where: { status: 1, travellersId: travellers.id },
      });
      if(!userLevel){
        await models.userLevel.create({ travellersId: travellers.id, status: 1 });
      }
      if (!travellers) {
        throw new UserInputError(langData.authAPI.email_no_exists);
      }
      const token = createToken(travellers, secret, '12d');
      return { token, categoryId, travellers };
    },

    travellerSocialLogin: async (
      parent,
      {
        firstName, lastName, screenName, emailId, socialId, loginType, UUID, gender, dob,
      },
      { models, secret, language },
    ) => {
      if (!language) {
        language = '2';
      }
      let langData = lang(language);
      let travellers;
      const data = {
        firstName,
        lastName,
        screenName,
        refreshToken: UUID,
        phone: '0000000000',
        emailId,
        gender,
        dob,
        socialId,
        userType: 1,
        loginType,
      };
      const checkEmail = await models.travellers.findOne({ where: { emailId: emailId } });
      if (checkEmail === null) {
        const add = await models.travellers.create(data);
        if (add) {
          travellers = await models.travellers.findByLogin(UUID);
          await models.userLevel.create({ travellersId: travellers.id, status: 1 });
          await models.userSettings.create({ travellersId: travellers.id, status: 1 });
        }
      } else {
        const updateData = {
          socialId,
          refreshToken: UUID,
          gender,
          dob,
        };
        const update = await models.travellers.update(updateData, { where: { id: checkEmail.id } });
        if (update) {
          travellers = await models.travellers.findByLogin(UUID);
        }
      }
      if (travellers === undefined) {
        throw new UserInputError(
          langData.authAPI.email_no_exists,
        );
      }
      const category = await models.userCategory.findOne({
        where: { status: 1, userId: travellers.id },
      });

      let categoryId = null;
      if (category) {
        categoryId = category.categoryId
      }
      const userSettings = await models.userSettings.findOne({
        where: { status: 1, travellersId: travellers.id },
      });
      if(!userSettings){
        await models.userSettings.create({ travellersId: travellers.id, status: 1 });
      }
      const userLevel = await models.userLevel.findOne({
        where: { status: 1, travellersId: travellers.id },
      });
      if(!userLevel){
        await models.userLevel.create({ travellersId: travellers.id, status: 1 });
      }
      const token = createToken(travellers, secret, '12d');
      return { token, categoryId, travellers };
    },

    travellerForgotPassword: async (parent, { resetToken, emailId }, { models, language }) => {
      if (!language) {
        language = '2';
      }
      let langData = lang(language);
      const user = await models.travellers.findOne({ where: { emailId } });
      if (user) {
        const postData = {
          resetToken,
        };
        const update = await models.travellers.update(postData, { where: { emailId } });
        if (update) {
          const subject = 'FORGOT PASSWORD';
          const message = `Hi, <br/>We recieved a request to reset the password for you account. Please use this '${resetToken}' resetCode to reset your password. <br/><br/><br/><br/>Thanks`;
          em.send(user.emailId, subject, message);
          const msg = {
            status: langData.authAPI.success,
            code: langData.authAPI.codeSuccess,
            message: langData.messageAPI.sendEmail,
          };
          return msg;
        }
      }
      throw new UserInputError(
        langData.authAPI.email_no_exists,
      );
    },

    // eslint-disable-next-line max-len
    travellersResetPassword: async (parent, { resetToken, newPassword, confirmPassword }, { models, language }) => {
      if (!language) {
        language = '2';
      }
      let langData = lang(language);
      const user = await models.travellers.findOne({ where: { resetToken } });
      if (user) {
        if (newPassword === confirmPassword) {
          const postData = {
            // eslint-disable-next-line no-undef
            password: bcrypt.hashSync(newPassword, 10),
          };
          const update = await models.travellers.update(postData, { where: { id: user.id } });
          if (update) {
            const msg = {
              status: langData.authAPI.success,
              code: langData.authAPI.codeSuccess,
              message: langData.messageAPI.passwordReset,
            };
            return msg;
          }
        }
      }
      throw new UserInputError(
        langData.authAPI.email_no_exists,
      );
    },

    updateFcm: async (parent, { fcmToken, userId }, { models, language }) => {
      if (!language) {
        language = '2';
      }
      let langData = lang(language);
      const postData = {
        fcmToken,
        userId,
      };
      const updateFcmToken = await models.travellers.update(postData, { where: { id: userId } });
      if (updateFcmToken) {
        const msg = {
          status: langData.authAPI.success,
          code: langData.authAPI.codeSuccess,
          message: langData.messageAPI.locationUpdated,
        };
        return msg;
      }
    },

    // eslint-disable-next-line camelcase
    updateLatLng: async (parent, { user_lat, user_lng, userId }, { models, language }) => {
      if (!language) {
        language = '2';
      }
      let langData = lang(language);
      const postData = {
        user_lat,
        user_lng,
        userId,
      };
      const updateLatLng = await models.travellers.update(postData, { where: { id: userId } });
      if (updateLatLng) {
        const msg = {
          status: langData.authAPI.success,
          code: langData.authAPI.codeSuccess,
          message: langData.messageAPI.locationUpdated,
        };
        return msg;
      }
    },

    travellersChangePassword: async (parent, {
      emailId, password, newPassword, confirmPassword,
    }, { models }) => {
      const user = await models.travellers.findOne({ where: { emailId } });
      if (user) {
        // eslint-disable-next-line no-undef
        const isValid = bcrypt.compareSync(password, user.password);
        if (isValid !== true) {
          throw new AuthenticationError('Invalid password.');
        }
        if (newPassword === confirmPassword) {
          const postData = {
            // eslint-disable-next-line no-undef
            password: bcrypt.hashSync(newPassword, 10),
          };
          const update = await models.travellers.update(postData, { where: { id: user.id } });
          if (update) {
            const msg = {
              status: 'success',
              code: 200,
              message: 'Password changed successfully',
            };
            return msg;
          }
        }
      }
      throw new UserInputError(
        langData.authAPI.email_no_exists,
      );
    },

    updateProfilePic: async (parent, { profilePic }, { models, me, language }) => {
      if (!language) {
        language = '2';
      }
      let langData = lang(language);
      const postData = {
        profilePic
      };
      const updateProfilePic = await models.travellers.update(postData, { where: { id: me.id } });
      if (updateProfilePic) {
        const msg = {
          status: langData.authAPI.success,
          code: langData.authAPI.codeSuccess,
          message: langData.messageAPI.updatedProfilePic,
        };
        return msg;
      }
    },

    removeProfilePic: async (parent, args, { models, me, language }) => {
      if (!language) {
        language = '2';
      }
      let langData = lang(language);

      if (!me) {
        // eslint-disable-next-line no-undef
        throw new AuthenticationError(langData.authAPI.auth_failed);
      }
      const removeProfilePic = await models.travellers.update({ profilePic: null }, { where: { id: me.id } });
      if (removeProfilePic) {
        const msg = {
          status: langData.authAPI.success,
          code: langData.authAPI.codeSuccess,
          message: langData.messageAPI.removedPic,
        };
        return msg;
      }
    },

    updateUserLanguage: async (parent, { selectedLang }, { models, me, language }) => {
      if (!language) {
        language = '2';
      }
      let langData = lang(language);

      if (!me) {
        throw new AuthenticationError(langData.authAPI.auth_failed);
      }

      const postData = {
        language: selectedLang
      };
      const updateselectedLang = await models.travellers.update(postData, { where: { id: me.id } });
      if (updateselectedLang) {
        const msg = {
          status: langData.authAPI.success,
          code: langData.authAPI.codeSuccess,
          message: langData.messageAPI.updatedLanguage,
        };
        return msg;
      }
    },

    updateProfile: async (parent, { id, firtsName, lastName, screenName, emailId, countryCode, phone, gender, dob, profilePic },
      { models, language }) => {
      if (!language) {
        language = '2';
      }
      let langData = lang(language);
      const postData = {
        firtsName,
        lastName,
        screenName,
        emailId,
        countryCode,
        phone,
        gender,
        dob,
        profilePic
      };
      const updateProfile = await models.travellers.update(postData, { where: { id: id } });
      if (updateProfile) {
        const msg = {
          status: langData.authAPI.success,
          code: langData.authAPI.codeSuccess,
          message: langData.messageAPI.updatedProfile
        };
        return msg;
      }
    },

  },
};

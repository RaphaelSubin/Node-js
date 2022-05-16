import { AuthenticationError, UserInputError } from 'apollo-server';
import jwt from 'jsonwebtoken';
import { createWriteStream } from 'fs';
import QRCode from 'qr-image';
import respObj from '../../assets/lang/en.json';
import { uniqueId, fcDirectUpload } from '../../utils/helpers';

const { authAPI, messageAPI, commonAPI } = respObj;

const createToken = (id, secret, expiresIn) => {
  const jwtToken = jwt.sign(id, secret, { expiresIn });
  return jwtToken;
};
export default {
  Query: {
    addQrcode: async (parent, args, { models }) => {
      try {
        const UniqeID = uniqueId();
        const qrPng = QRCode.image(UniqeID, { type: 'png' });
        qrPng.pipe(createWriteStream(`./${UniqeID}.png`));
        const path = `./${UniqeID}.png`;
        const file = await fcDirectUpload(path);
        const data = { UniqeID, qrImage: file.filename, status: 1 };
        await models.qrCode.create(data);
        const msg = {
          uniqueId: UniqeID,
          fileName: file.filename,
        };
        return msg;
      } catch (error) {
        throw new UserInputError(error);
      }
    },
    Qrauth: async (parent, args, { models, secret }) => {
      const Valid = await models.qrCode.findOne({
        where: { UniqeID: args.UniqeID, status: 1, isLogin: 'true' },
      });
      try {
        if (!Valid) {
          throw new AuthenticationError(authAPI.auth_failed);
        } else {
          const resp = await models.travellers.findOne({
            where: { refreshToken: Valid.refreshToken, userType: 2 },
          });
          if (!resp) {
            throw new AuthenticationError(authAPI.auth_failed);
          }
          const user = {
            id: resp.id,
            email: resp.emailId,
            userType: resp.userType,
            screenName: resp.screenName,
            refreshToken: resp.refreshToken,
            categoryId: resp.categoryId,
          };
          const token = createToken(user, secret, '12h');
          const msg = {
            isLogin: Valid.isLogin,
            token,
          };
          return msg;
        }
      } catch (error) {
        throw new UserInputError(error);
      }
    },
  },
  Mutation: {
    qrLogin: async (parent, args, { models, me }) => {
      try {
        if (!me) {
          throw new AuthenticationError(authAPI.auth_failed);
        }
        const Valid = await models.travellers.findOne({
          where: { refreshToken: me.refreshToken, userType: 2 },
        });
        if (!Valid) {
          throw new AuthenticationError(authAPI.auth_failed);
        }
        const resp = await models.qrCode.findOne({
          where: { UniqeID: args.UniqeID, status: 1 },
        });
        if (resp) {
          const data = { refreshToken: me.refreshToken, isLogin: true };
          await models.qrCode.update(data, {
            where: { UniqeID: args.UniqeID },
          });
          const msg = {
            status: authAPI.success,
            code: authAPI.codeSuccess,
            message: commonAPI.Update,
          };
          return msg;
        }
        const msg = {
          status: authAPI.error,
          code: authAPI.codeError,
          message: messageAPI.InvalidQrcode,
        };
        return msg;
      } catch (error) {
        throw new UserInputError(error);
      }
    },
  },
};

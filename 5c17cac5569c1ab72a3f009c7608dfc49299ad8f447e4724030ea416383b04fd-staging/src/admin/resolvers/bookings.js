import { UserInputError } from 'apollo-server';
import { Op } from 'sequelize';
// eslint-disable-next-line import/named
import {
  getPagination,
  getPagingData,
  generateCsv,
  uniqueId,
  fcDirectUpload,
} from '../../utils/helpers';

const fileName = `bookingsexport-${uniqueId()}.csv`;
export default {
  Query: {
    bookingsList: async (parent, { size, page }, { models }) => {
      try {
        const condition = { [Op.not]: [{ status: 2 }] };
        const { limit, offset } = getPagination(page, size);
        const resp = await models.bookings.findAndCountAll({
          include: [
            {
              model: models.travellers,
              required: false,
              as: 'travellers',
            },
            {
              model: models.hotels,
              required: false,
              as: 'hotels',
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
    bookingsOne: async (parent, { id }, { models }) => {
      try {
        const resp = await models.bookings.findOne({
          include: [
            {
              model: models.travellers,
              required: false,
              as: 'travellers',
            },
            {
              model: models.hotels,
              required: false,
              as: 'hotels',
            },
          ],
          where: { id, status: 1 },
        });
        return resp;
      } catch (error) {
        throw new UserInputError(error);
      }
    },
    bookingsExport: async (parent, { fields }, { models }) => {
      try {
        const condition = { [Op.not]: [{ status: 2 }] };
        const resp = await models.bookings.findAll({
          include: [
            {
              model: models.travellers,
              attributes: [
                ['id', 'travellersId'],
                'firstName',
                'lastName',
                'screenName',
                'gender',
                'dob',
                'status',
              ],
              required: false,
              as: 'travellers',
            },
            {
              model: models.hotels,
              attributes: [
                ['id', 'hotelTableId'],
                'hotelId',
                'hotelName',
                'address',
                'place',
                'phone',
                'status',
              ],
              required: false,
              as: 'hotels',
            },
          ],
          attributes: fields,
          where: condition,
          raw: true,
        });
        const csvFields = fields;
        await generateCsv(csvFields, resp, fileName);
        const path = `./${fileName}`;
        const file = await fcDirectUpload(path);
        const msg = {
          fileName: file.filename,
        };
        return msg;
      } catch (error) {
        throw new UserInputError(error);
      }
    },
  },
};

/* eslint-disable linebreak-style */
/* eslint-disable no-unused-vars */
/* eslint-disable import/named */
/* eslint-disable import/order */
/* eslint-disable import/first */
/* eslint-disable linebreak-style */
import { UserInputError } from 'apollo-server';
import { Op } from 'sequelize';

const sequelize = require('sequelize');

// eslint-disable-next-line import/named
import {
  getPagination,
  getPagingData,
  generateCsv,
  uniqueId,
  fcDirectUpload,
} from '../../utils/helpers';

const fileName = `hotelsexport-${uniqueId()}.csv`;
export default {
  Query: {
    hotelList: async (parent, { size, page }, { models }) => {
      try {
        const condition = { [Op.not]: [{ status: 2 }] };
        const { limit, offset } = getPagination(page, size);
        const resp = await models.hotels.findAndCountAll({
          where: condition,
          order: [['id', 'DESC']],
          attributes: {
            include: [
              [
                sequelize.fn('COUNT', sequelize.col('bookings.id')),
                'bookingsCount',
              ],
            ],
          },
          include: [
            {
              model: models.bookings,
              attributes: [],
              as: 'bookings',
              duplicating: false,
            },
          ],
          raw: true,
          group: ['hotels.id'],
          limit,
          offset,
        });
        const totalItems = await models.hotels.count({
          where: condition,
          include: [
            {
              model: models.bookings,
              as: 'bookings',
              attributes: ['id'],
            },
          ],
        });
        const { rows: data } = resp;
        const currentPage = page ? +page : 0;
        const totalPages = Math.ceil(totalItems / limit);
        return {
          totalItems,
          data,
          totalPages,
          currentPage,
        };
      } catch (error) {
        throw new UserInputError(error);
      }
    },
    hotelsOne: async (parent, { id }, { models }) => {
      try {
        const resp = await models.hotels.findOne({
          where: { id, status: 1 },
        });
        const bookings = await models.bookings.findAll({
          include: [
            {
              model: models.hotels,
              required: false,
              as: 'hotels',
            },
          ],
          where: { hotelId: id },
        });
        const data = {
          id: resp.dataValues.id,
          hotelId: resp.dataValues.hotelId,
          hotelName: resp.dataValues.hotelName,
          address: resp.dataValues.address,
          lat: resp.dataValues.lat,
          lng: resp.dataValues.lng,
          place: resp.dataValues.place,
          phone: resp.dataValues.place,
          image: resp.dataValues.image,
          status: resp.dataValues.status,
          bookingsCount: bookings.length,
          bookings,
        };
        return data;
      } catch (error) {
        throw new UserInputError(error);
      }
    },
    hotelsExport: async (parent, { fields }, { models }) => {
      try {
        const condition = { [Op.not]: [{ status: 2 }] };
        const resp = await models.hotels.findAll({
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

import { UserInputError } from 'apollo-server';

const sequelize = require('sequelize');

export default {
  Query: {
    dashboardDetails: async (parent, args, { models }) => {
      try {
        const video = await models.videos.findAll({
          where: { status: 1 },
        });
        const travellers = await models.travellers.findAll({
          where: { status: 1, userType: 1 },
        });
        const influencers = await models.travellers.findAll({
          where: { status: 1, userType: 2 },
        });
        const bookings = await models.bookings.findAll({
          where: { status: 1 },
        });
        const hotels = await models.hotels.findAll({
          where: { status: 1 },
        });
        const adsManagers = await models.adsManager.findAll({
          where: { status: 1 },
        });
        const data = {
          videosCount: video.length,
          travellersCount: travellers.length,
          influencersCount: influencers.length,
          bookingsCount: bookings.length,
          hotelsCount: hotels.length,
          adsManagersCount: adsManagers.length,
        };
        return data;
      } catch (error) {
        throw new UserInputError(error);
      }
    },
    dashboardPage: async (parent, { size }, { models }) => {
      try {
        const travellers = await models.travellers.findAll({
          where: { status: 1, userType: 2 },
          attributes: {
            include: [
              [
                sequelize.fn('COUNT', sequelize.col('follower.id')),
                'FollowersCount',
              ],
            ],
          },
          include: [
            {
              model: models.followers,
              attributes: [],
              as: 'follower',
              order: [[sequelize.literal('FollowersCount'), 'ASC']],
              duplicating: false,
            },
          ],
          group: ['travellers.id'],
          raw: true,
        });
        const traveller = travellers.slice(0, size);

        const recentOrders = await models.bookings.findAll({
          where: { status: 1 },
          order: [['id', 'DESC']],
        });
        const CategoryList = await models.category.findAll({
          where: { status: 1 },
          attributes: {
            include: [
              [
                sequelize.fn('COUNT', sequelize.col('videos.id')),
                'CategoryVideoCount',
              ],
            ],
          },
          include: [
            {
              model: models.videos,
              attributes: [],
              as: 'videos',
              order: [[sequelize.literal('CategoryVideoCount'), 'ASC']],
              duplicating: false,
            },
          ],
          raw: true,
          group: ['category.id'],
        });
        const CategoryLists = CategoryList.slice(0, size);

        const videos = await models.videos.findAll({
          where: { status: 1 },
          order: [
            ['likeCount', 'desc'],
            ['commentCount', 'desc'],
            ['viewCount', 'desc'],
            ['shareCount', 'desc'],
          ],
          limit: size,
        });
        const data = {
          recentOrders,
          PopularInfluencers: traveller,
          TrendingVideos: videos,
          CategoryVideoPieChart: CategoryLists,
        };
        return data;
      } catch (error) {
        throw new UserInputError(error);
      }
    },
  },
};

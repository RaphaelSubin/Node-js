import { AuthenticationError, UserInputError } from 'apollo-server';
import { Op } from 'sequelize';
import { getPagination, getPagingData } from '../../utils/helpers';
import respObj from '../../assets/lang/en.json';
import Models from '../../models/index';

const { authAPI, commonAPI, messageAPI } = respObj;
const cron = require('node-cron');

cron.schedule('0 0 1 * *', async () => {
  try {
    const condition = { [Op.not]: [{ status: 2 }], paymentType: 1 };
    const resp = await Models.campaign.findAll({
      where: condition,
      raw: true,
    });
    const date = new Date();
    const today = new Date().toISOString().slice(0, 10);
    const firstDate = `${date.getFullYear()}-${(date.getMonth() + 1)
      .toString()
      .padStart(2, '0')}-${(date.getDate(), 1).toString().padStart(2, '0')}`;
    const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    const lastDate = `${lastDay.getFullYear()}-${(lastDay.getMonth() + 1)
      .toString()
      .padStart(2, '0')}-${lastDay.getDate().toString().padStart(2, '0')}`;
    if (today === firstDate) {
      if (resp) {
        resp.forEach(async (item) => {
          const adsData = await Models.adsManager.findOne({
            where: { id: item.adsManagerId },
          });
          const campaignData = { status: 0 };
          await Models.campaign.update(campaignData, {
            where: { id: item.id, paymentType: 1 },
          });
          await Models.activeCampaign.update(campaignData, {
            where: { campaignId: item.id, paymentType: 1 },
          });
          const Totalamount = adsData.Wallet;
          if (Totalamount >= item.budget) {
            const postData = {
              lockWallet: adsData.lockWallet,
              Wallet: adsData.Wallet - item.budget,
            };
            await Models.adsManager.update(postData, {
              where: { id: item.adsManagerId },
            });
            const campData = {
              campaignId: item.id,
              adsManagerId: item.adsManagerId,
              startDate: firstDate,
              endDate: lastDate,
              budget: item.budget,
              paymentType: item.paymentType,
              status: 1,
            };
            await Models.activeCampaign.create(campData);
          }
        });
      }
    }
  } catch (error) {
    throw new UserInputError(error);
  }
});
export default {
  Query: {
    CampaignList: async (parent, { size, page }, { models, me }) => {
      if (!me) {
        throw new AuthenticationError(authAPI.auth_failed);
      }
      try {
        const adsId = await models.adsManager.findOne({
          where: { refreshToken: me.refreshToken },
        });
        const condition = { [Op.not]: [{ status: 2 }], adsManagerId: adsId.id };
        const { limit, offset } = getPagination(page, size);
        const resp = await models.campaign.findAndCountAll({
          include: [
            {
              model: models.campaignCategory,
              as: 'campaignCategory',
              required: false,
              include: [
                {
                  model: models.category,
                  as: 'category',
                },
              ],
            },
            {
              model: models.campaignState,
              as: 'campaignState',
              required: false,
              include: [
                {
                  model: models.states,
                  as: 'state',
                },
              ],
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
    CampaignActiveList: async (parent, { size, page }, { models, me }) => {
      try {
        const condition = { status: 1 };
        const { limit, offset } = getPagination(page, size);
        const resp = await models.activeCampaign.findAndCountAll({
          include: [
            {
              model: models.campaign,
              as: 'campaign',
              include: [
                {
                  model: models.campaignState,
                  as: 'campaignState',
                  include: [
                    {
                      model: models.states,
                      as: 'state',
                    },
                  ],
                },
                {
                  model: models.campaignCategory,
                  as: 'campaignCategory',
                  required: false,
                  include: [
                    {
                      model: models.category,
                      as: 'category',
                    },
                  ],
                },
              ],
            },
            {
              model: models.adsManager,
              as: 'adsManager',
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
    CampaignOne: async (parent, { id }, { models }) => {
      try {
        const resp = await models.campaign.findByPk(id);
        return resp;
      } catch (error) {
        throw new UserInputError(error);
      }
    },
    Campaigncheck: async () => {
      try {
        const condition = { [Op.not]: [{ status: 2 }], paymentType: 1 };
        const resp = await Models.campaign.findAll({
          where: condition,
          raw: true,
        });
        const date = new Date();
        const today = '2021-04-01';
        const firstDate = `${date.getFullYear()}-${(date.getMonth() + 1)
          .toString()
          .padStart(2, '0')}-${(date.getDate(), 1)
          .toString()
          .padStart(2, '0')}`;
        const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
        const lastDate = `${lastDay.getFullYear()}-${(lastDay.getMonth() + 1)
          .toString()
          .padStart(2, '0')}-${lastDay.getDate().toString().padStart(2, '0')}`;
        if (today === firstDate) {
          if (resp) {
            resp.forEach(async (item) => {
              const adsData = await Models.adsManager.findOne({
                where: { id: item.adsManagerId },
              });
              const campaignData = { status: 0 };
              await Models.campaign.update(campaignData, {
                where: { id: item.id, paymentType: 1 },
              });
              await Models.activeCampaign.update(campaignData, {
                where: { campaignId: item.id, paymentType: 1 },
              });
              const Totalamount = adsData.Wallet;
              if (Totalamount >= item.budget) {
                const postData = {
                  lockWallet: adsData.lockWallet,
                  Wallet: adsData.Wallet - item.budget,
                };
                await Models.adsManager.update(postData, {
                  where: { id: item.adsManagerId },
                });
                const campData = {
                  campaignId: item.id,
                  adsManagerId: item.adsManagerId,
                  startDate: firstDate,
                  endDate: lastDate,
                  budget: item.budget,
                  paymentType: item.paymentType,
                  status: 1,
                };
                await Models.activeCampaign.create(campData);
              }
            });
          }
        }
        const msg = {
          status: process.env.STATUS_SUCCESS,
          message: commonAPI.Update,
        };
        return msg;
      } catch (error) {
        throw new UserInputError(error);
      }
    },
    CampaignOneList: async (parent, { id }, { models }) => {
      try {
        const condition = { [Op.not]: [{ status: 2 }], id };
        const resp = await models.campaign.findOne({
          include: [
            {
              model: models.campaignCategory,
              as: 'campaignCategory',
              include: [
                {
                  model: models.category,
                  as: 'category',
                },
              ],
            },
            {
              model: models.campaignState,
              as: 'campaignState',
              required: false,
              include: [
                {
                  model: models.states,
                  as: 'state',
                },
              ],
            },
          ],
          where: condition,
          order: [['id', 'DESC']],
        });
        return resp;
      } catch (error) {
        throw new UserInputError(error);
      }
    },
  },

  Mutation: {
    addCampaign: async (parent, args, { models, me }) => {
      if (!me) {
        throw new AuthenticationError(authAPI.auth_failed);
      }
      let lastDate;
      try {
        const resp = await models.adsManager.findOne({
          where: { refreshToken: me.refreshToken },
        });
        const Totalamount = resp.Wallet;
        const { budget } = args;

        const data = { ...args, adsManagerId: resp.id, status: 1 };
        const campaign = await models.campaign.create(data);
        if (args.category) {
          args.category.forEach(async (item) => {
            const category = {
              campaignId: campaign.id,
              categoryId: item,
            };
            await models.campaignCategory.create(category);
          });
        }
        if (args.state) {
          args.state.forEach(async (statesid) => {
            const states = {
              campaignId: campaign.id,
              stateId: statesid,
            };
            await models.campaignState.create(states);
          });
        }
        if (Totalamount >= budget) {
          const postData = {
            lockWallet: resp.lockWallet + budget,
            Wallet: resp.Wallet - budget,
          };
          const date = new Date();
          const firstDate = `${date.getFullYear()}-${(date.getMonth() + 1)
            .toString()
            .padStart(2, '0')}-${(date.getDate(), 1)
            .toString()
            .padStart(2, '0')}`;
          const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
          if (campaign.paymentType === 1) {
            lastDate = `${lastDay.getFullYear()}-${(lastDay.getMonth() + 1)
              .toString()
              .padStart(2, '0')}-${lastDay
              .getDate()
              .toString()
              .padStart(2, '0')}`;
          }
          const campData = {
            campaignId: campaign.id,
            adsManagerId: campaign.adsManagerId,
            startDate: firstDate,
            endDate: lastDate,
            budget: campaign.budget,
            paymentType: campaign.paymentType,
            status: 1,
          };
          await models.activeCampaign.create(campData);
          await models.adsManager.update(postData, {
            where: { refreshToken: me.refreshToken },
          });
          const msg = {
            status: process.env.STATUS_SUCCESS,
            message: commonAPI.Sucess,
          };
          return msg;
        }
        const msg = {
          status: process.env.STATUS_SUCCESS,
          message: messageAPI.campaignerror,
        };
        return msg;
      } catch (error) {
        throw new UserInputError(error);
      }
    },
    updateCampaign: async (parent, args, { models, me }) => {
      if (!me) {
        throw new AuthenticationError(authAPI.auth_failed);
      }
      try {
        const resp = await models.adsManager.findOne({
          where: { refreshToken: me.refreshToken },
        });
        const Totalamount = resp.Wallet;
        const { budget } = args;

        const data = { ...args, adsManagerId: resp.id, status: 1 };
        const uid = data.id;
        await models.campaign.update(data, {
          where: { id: uid },
        });
        if (args.category) {
          await models.campaignCategory.destroy({ where: { campaignId: uid } });
          args.category.forEach(async (item) => {
            const category = {
              campaignId: uid,
              categoryId: item,
            };
            await models.campaignCategory.create(category);
          });
        }
        if (args.state) {
          await models.campaignState.destroy({ where: { campaignId: uid } });
          args.state.forEach(async (statesid) => {
            const states = {
              campaignId: uid,
              stateId: statesid,
            };
            await models.campaignState.create(states);
          });
        }
        if (Totalamount >= budget) {
          const postData = {
            lockWallet: resp.lockWallet + budget,
            Wallet: resp.Wallet - budget,
          };
          await models.adsManager.update(postData, {
            where: { refreshToken: me.refreshToken },
          });
          const msg = {
            status: process.env.STATUS_SUCCESS,
            message: commonAPI.Update,
          };
          return msg;
        }
        const msg = {
          status: process.env.STATUS_SUCCESS,
          message: messageAPI.campaignerror,
        };
        return msg;
      } catch (error) {
        throw new UserInputError(error);
      }
    },
    CampaignStatus: async (parent, { id, status }, { models, me }) => {
      if (!me) {
        throw new AuthenticationError(authAPI.auth_failed);
      }
      try {
        const resp = await models.adsManager.findOne({
          where: { refreshToken: me.refreshToken },
        });
        const Campaign = await models.campaign.findOne({
          where: { id },
        });
        const Totalamount = resp.Wallet;
        const { budget } = Campaign;
        const data = { status };

        if (Totalamount >= budget) {
          const postData = {
            lockWallet: resp.lockWallet + budget,
            Wallet: resp.Wallet - budget,
          };
          const activedata = { status: 0 };
          await models.campaign.update(activedata, {
            where: { id: Campaign.id },
          });
          const date = new Date();
          const firstDate = `${date.getFullYear()}-${(date.getMonth() + 1)
            .toString()
            .padStart(2, '0')}-${(date.getDate(), 1)
            .toString()
            .padStart(2, '0')}`;
          const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
          const lastDate = `${lastDay.getFullYear()}-${(lastDay.getMonth() + 1)
            .toString()
            .padStart(2, '0')}-${lastDay
            .getDate()
            .toString()
            .padStart(2, '0')}`;
          const campData = {
            campaignId: Campaign.id,
            startDate: firstDate,
            endDate: lastDate,
            budget: Campaign.budget,
            paymentType: Campaign.paymentType,
            status: 1,
          };
          await models.activeCampaign.create(campData);
          await models.adsManager.update(postData, {
            where: { refreshToken: me.refreshToken },
          });
          await models.campaign.update(data, { where: { id } });

          const msg = {
            status: process.env.STATUS_SUCCESS,
            message: commonAPI.Update,
          };
          return msg;
        }
        await models.campaign.update({ status: 0 }, { where: { id } });
        const msg = {
          status: process.env.STATUS_SUCCESS,
          message: messageAPI.campaignerror,
        };
        return msg;
      } catch (error) {
        throw new UserInputError(error);
      }
    },
  },
};

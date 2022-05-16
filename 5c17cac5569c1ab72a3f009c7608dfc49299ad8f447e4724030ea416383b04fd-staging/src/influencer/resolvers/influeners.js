import jwt from 'jsonwebtoken';
import { AuthenticationError, UserInputError } from 'apollo-server';
import FirebaseAuth from 'firebaseauth';
const serviceAccount = require('../../assets/file/serviceAccount.json');
const firebase = new FirebaseAuth(serviceAccount.FIREBASE_API_KEY);
import respObj from '../../assets/lang/en.json';
const { authAPI, messageAPI, commonAPI } = respObj;
import { Op } from 'sequelize';
import { getPagination } from '../../utils/helpers';
const sequelize = require('sequelize');

const getAge = (time) => {
  let MILLISECONDS_IN_A_YEAR = 1000 * 60 * 60 * 24 * 365;
  let date_array = time.split('-');
  let years_elapsed =
    (new Date() - new Date(date_array[0], date_array[1], date_array[2])) /
    MILLISECONDS_IN_A_YEAR;
  return parseInt(years_elapsed);
};
const inRange = (x, min, max) => {
  return (x - min) * (x - max) <= 0;
};
const createToken = async (traveller, secret, expiresIn) => {
  const {
    id,
    emailId,
    screenName,
    userType,
    refreshToken,
    categoryId,
  } = traveller;
  const jwtToken = await jwt.sign(
    {
      id,
      emailId,
      screenName,
      userType,
      refreshToken,
      categoryId,
    },
    secret,
    {
      expiresIn,
    }
  );
  return jwtToken;
};

const firebaseLogin = async (email, password, resp) => {
  try {
    firebase.signInWithEmail(email, password, function (err, result) {
      resp(err?.message, result?.user?.id);
    });
  } catch (error) {
    throw new UserInputError(authAPI.auth_failed);
  }
};

export default {
  Query: {
    influencerProfile: async (parent, args, { models, me }) => {
      if (!me) {
        throw new AuthenticationError(authAPI.auth_failed);
      }
      const resp = await models.travellers.findOne({
        where: { refreshToken: me.refreshToken, userType: 2 },
      });
      return resp;
    },
    cppRequestList: async (parent, { size, page, iscpp }, { models }) => {
      try {
        const condition = { iscpp, [Op.not]: [{ status: 2 }] };
        const { limit, offset } = getPagination(page, size);
        const resp = await models.travellers.findAndCountAll({
          where: condition,
          order: [['id', 'DESC']],
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
              duplicating: false,
            },
          ],
          group: ['travellers.id'],
          raw: true,
          limit,
          offset,
        });
        const totalItems = await models.travellers.count({
          where: condition,
          include: [
            {
              model: models.followers,
              as: 'follower',
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
    cppOneBytoken: async (parent, args, { models, me }) => {
      try {
        if (!me) {
          throw new AuthenticationError(authAPI.auth_failed);
        }
        const condition = {
          refreshToken: me.refreshToken,
          userType: 2,
          [Op.not]: [{ status: 2 }],
        };
        const resp = await models.travellers.findOne({
          where: condition,
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
              duplicating: false,
            },
          ],
          group: ['travellers.id'],
          raw: true,
        });
        let Difference_In_Days = 0;
        let isEligible = false;
        let canReAply;
        if (resp.iscpp === 3) {
          const today = new Date(new Date().toISOString().split('T')[0]);
          const rejdate = new Date(resp.rejectDate);
          const Difference_In_Time = today.getTime() - rejdate.getTime();
          Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);
          if (Difference_In_Days >= 30) {
            canReAply = true;
            Difference_In_Days = 0;
            if (resp.FollowersCount > 2 && resp.watchtime > 4000) {
              isEligible = true;
              canReAply = true;
            }
          } else {
            canReAply = false;
          }
        }

        return {
          isEligible,
          FollowersCount: resp.FollowersCount,
          watchtime: resp.watchtime,
          iscpp: resp.iscpp,
          canReAply,
          remainingDays: Difference_In_Days,
        };
      } catch (error) {
        throw new UserInputError(error);
      }
    },
    influencerOverview: async (parent, args, { models, me }) => {
      let start;
      let end;
      let oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 27);
      start = oneWeekAgo.toISOString().split('T')[0];
      end = new Date(new Date().toISOString().split('T')[0]);
      if (args.startDate && args.endDate) {
        start = args.startDate;
        end = args.endDate;
      }
      start = new Date(start);
      end = new Date(end);
      let dateData = [];
      let FollowersData = [];
      let VideosData = [];
      try {
        if (!me) {
          throw new AuthenticationError(authAPI.auth_failed);
        }
        const commission = await models.commission.findOne({
          where: { status: 1 },
        });
        let loop = new Date(start);
        while (loop <= end) {
          let loopDate = new Date(loop).toISOString().split('T')[0];
          let dayName = new Date(loop).toString().split(' ')[0];
          dateData.push({
            days: dayName,
            dates: loopDate,
          });
          let newDate = loop.setDate(loop.getDate() + 1);
          loop = new Date(newDate);
        }
        for (const dateData of dateData) {
          let condition = {
            refreshToken: me.refreshToken,
            userType: 2,
            [Op.and]: [
              sequelize.where(
                sequelize.fn('date', sequelize.col('follower.createdAt')),
                '=',
                dateData.dates
              ),
            ],
            [Op.not]: [{ status: 2 }],
          };
          let followers = await models.travellers.findOne({
            where: condition,
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
                duplicating: false,
              },
            ],
            group: ['travellers.id'],
            raw: true,
          });
          let Total = await models.videosAnalytics.findAll({
            where: {
              InfluencerId: me.id,
              [Op.and]: [
                sequelize.where(
                  sequelize.fn('date', sequelize.col('createdAt')),
                  '=',
                  dateData.dates
                ),
              ],
              status: 1,
            },
            attributes: [
              [sequelize.fn('sum', sequelize.col('clicks')), 'totalclicks'],
              [sequelize.fn('sum', sequelize.col('impression')), 'totalviews'],
              [
                sequelize.fn('sum', sequelize.col('watchtime')),
                'totalwatchtime',
              ],
            ],
            raw: true,
          });
          let TotalClicks = 0;
          let TotalViews = 0;
          let TotalWatchtime = 0;
          if (Total[0].totalclicks) {
            TotalClicks = Total[0].totalclicks;
          }
          if (Total[0].totalviews) {
            TotalViews = Total[0].totalviews;
          }
          if (Total[0].totalwatchtime) {
            TotalWatchtime = Total[0].totalwatchtime;
          }
          let videos = await models.videos.findOne({
            where: {
              status: 1,
              userId: me.id,
              [Op.and]: [
                sequelize.where(
                  sequelize.fn('date', sequelize.col('createdAt')),
                  '=',
                  dateData.dates
                ),
              ],
            },
            order: [['watchtime', 'desc']],
            limit: 5,
          });
          let FollowersCount = 0;
          let watchtime = 0;
          let ViewsCount = 0;
          if (followers) {
            FollowersCount = followers.FollowersCount;
            watchtime = followers.watchtime;
            ViewsCount = followers.viewcount;
          }

          let CTR = parseFloat(TotalClicks) / parseFloat(TotalViews);
          CTR = CTR || 0;
          let CPC = TotalClicks * commission.clickAmount;
          let Cost = (TotalWatchtime / commission.clickAmount + CPC).toFixed(2);

          FollowersData.push({
            days: dateData.days,
            dates: dateData.dates,
            FollowersCount: FollowersCount,
            ViewsCount: ViewsCount,
            Watchtime: watchtime,
            TotalClicks,
            TotalWatchtime,
            TotalViews,
            clickAmount: commission.clickAmount,
             viewAmount: commission.viewAmount,
            watchAmount: commission.watchtimeAmount,
            CTR,
            CPC,
            Cost,
          });
          if (videos) {
            VideosData.push(videos);
          }
        }

        const resp = await models.travellers.findOne({
          where: {
            refreshToken: me.refreshToken,
            userType: 2,
            status: 1,
          },
        });
        let iscpp = 1;
        if (resp) {
          iscpp = resp.iscpp;
        }
        const data = {
          chartData: FollowersData,
          Topvideos: VideosData,
          iscpp,
        };
        return data;
      } catch (error) {
        throw new UserInputError(error);
      }
    },
    influencerAudience: async (parent, args, { models, me }) => {
      let condition;
      let gender;
      let males = 0;
      let females = 0;
      let subscribed = 0;
      let notSubscribed = 0;
      let ageGroup;
      let fgroup = 0;
      let sgroup = 0;
      let tgroup = 0;
      let lgroup = 0;
      let countryData = [];
      let watchTimeFromFollower;
      let oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 27);
      let oneWeekAgoFormat = oneWeekAgo.toISOString().split('T')[0];
      let today = new Date(new Date().toISOString().split('T')[0]);
      try {
        if (!me) {
          throw new AuthenticationError(authAPI.auth_failed);
        }
        if (args.startDate && args.endDate) {
          condition = {
            InfluencerId: me.id,
            [Op.and]: [
              sequelize.where(
                sequelize.fn(
                  'date',
                  sequelize.col('videosAnalytics.createdAt')
                ),
                '>=',
                args.startDate
              ),
              sequelize.where(
                sequelize.fn(
                  'date',
                  sequelize.col('videosAnalytics.createdAt')
                ),
                '<=',
                args.endDate
              ),
            ],
            status: 1,
          };
        } else {
          condition = {
            InfluencerId: me.id,
            [Op.and]: [
              sequelize.where(
                sequelize.fn(
                  'date',
                  sequelize.col('videosAnalytics.createdAt')
                ),
                '>=',
                oneWeekAgoFormat
              ),
              sequelize.where(
                sequelize.fn(
                  'date',
                  sequelize.col('videosAnalytics.createdAt')
                ),
                '<=',
                today
              ),
            ],
            status: 1,
          };
        }

        let videosData = await models.videosAnalytics.findAll({
          where: condition,
          raw: true,
        });
        let totalViewers = videosData.length;
        for (videosData of videosData) {
          let resp = await models.travellers.findOne({
            where: { id: videosData.viewId },
          });
          let countries = await models.travellers.findOne({
            where: { id: videosData.viewId },
            raw: true,
            group: ['country', 'travellers.id'],
            order: [['watchtime', 'desc']],
          });
          let followers = await models.followers.findOne({
            where: {
              followersId: videosData.viewId,
              travellersId: videosData.InfluencerId,
            },
            raw: true,
          });
          if (followers) {
            subscribed++;
          }
          if (countries) {
            countryData.push({
              name: countries.country,
              watchtime: countries.watchtime,
            });
          }
          males = await models.travellers.count({
            where: { status: 1, gender: 'male', id: videosData.viewId },
          });
          if (resp) {
            let currentAge = getAge(resp.dob);
            let fCheck = inRange(currentAge, 15, 24);
            let sCheck = inRange(currentAge, 55, 44);
            let tCheck = inRange(currentAge, 45, 60);
            let lCheck = inRange(currentAge, 61, 100);
            if (fCheck) {
              fgroup++;
            }
            if (sCheck) {
              sgroup++;
            }
            if (tCheck) {
              tgroup++;
            }
            if (lCheck) {
              lgroup++;
            }
          }
          females = await models.travellers.count({
            where: { status: 1, gender: 'female', id: videosData.viewId },
          });
        }
        let Minussubscribe = subscribed - totalViewers;
        notSubscribed = Math.abs(Minussubscribe);
        gender = { males, females };
        watchTimeFromFollower = { subscribed, notSubscribed };
        ageGroup = {
          fifteenToTwentyFour: fgroup,
          twentyfiveTofortyFour: sgroup,
          fortyfiveTosixty: tgroup,
          sixtyoneToabove: lgroup,
        };
        return {
          Gender: gender,
          ageGroup,
          topCountries: countryData,
          watchTimeFromFollowers: watchTimeFromFollower,
        };
      } catch (error) {
        throw new UserInputError(error);
      }
    },
    influencerRevenue: async (parent, args, { models, me }) => {
      let start;
      let end;
      let oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 27);
      start = oneWeekAgo.toISOString().split('T')[0];
      end = new Date(new Date().toISOString().split('T')[0]);
      if (args.startDate && args.endDate) {
        start = args.startDate;
        end = args.endDate;
      }
      start = new Date(start);
      end = new Date(end);
      let dateData = [];
      let FollowersData = [];
      let RevenueData = [];
      try {
        if (!me) {
          throw new AuthenticationError(authAPI.auth_failed);
        }
        const commission = await models.commission.findOne({
          where: { status: 1 },
        });
        let loop = new Date(start);
        while (loop <= end) {
          let loopDate = new Date(loop).toISOString().split('T')[0];
          let dayName = new Date(loop).toString().split(' ')[0];
          dateData.push({
            days: dayName,
            dates: loopDate,
          });
          let newDate = loop.setDate(loop.getDate() + 1);
          loop = new Date(newDate);
        }

        for (dateData of dateData) {
          let condition = {
            refreshToken: me.refreshToken,
            userType: 2,
            [Op.and]: [
              sequelize.where(
                sequelize.fn('date', sequelize.col('follower.createdAt')),
                '=',
                dateData.dates
              ),
            ],
            [Op.not]: [{ status: 2 }],
          };
          let followers = await models.travellers.findOne({
            where: condition,
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
                duplicating: false,
              },
            ],
            group: ['travellers.id'],
            raw: true,
          });
          let Total = await models.videosAnalytics.findAll({
            where: {
              InfluencerId: me.id,
              [Op.and]: [
                sequelize.where(
                  sequelize.fn('date', sequelize.col('createdAt')),
                  '=',
                  dateData.dates
                ),
              ],
              status: 1,
            },
            attributes: [
              [sequelize.fn('sum', sequelize.col('clicks')), 'totalclicks'],
              [sequelize.fn('sum', sequelize.col('impression')), 'totalviews'],
              [
                sequelize.fn('sum', sequelize.col('watchtime')),
                'totalwatchtime',
              ],
            ],
            raw: true,
          });
          let TotalClicks = 0;
          let TotalViews = 0;
          let TotalWatchtime = 0;
          if (Total[0].totalclicks) {
            TotalClicks = Total[0].totalclicks;
          }
          if (Total[0].totalviews) {
            TotalViews = Total[0].totalviews;
          }
          if (Total[0].totalwatchtime) {
            TotalWatchtime = Total[0].totalwatchtime;
          }

          let FollowersCount = 0;
          let watchtime = 0;
          let ViewsCount = 0;
          if (followers) {
            FollowersCount = followers.FollowersCount;
            watchtime = followers.watchtime;
            ViewsCount = followers.viewcount;
          }

          let CTR = parseFloat(TotalClicks) / parseFloat(TotalViews);
          CTR = CTR || 0;
          let CPC = TotalClicks * commission.clickAmount;
          let Cost = (TotalWatchtime / commission.clickAmount + CPC).toFixed(2);

          FollowersData.push({
            days: dateData.days,
            dates: dateData.dates,
            FollowersCount: FollowersCount,
            ViewsCount: ViewsCount,
            Watchtime: watchtime,
            TotalClicks,
            TotalWatchtime,
            TotalViews,
            clickAmount: commission.clickAmount,
            viewAmount: commission.viewAmount,
            watchAmount: commission.watchtimeAmount,
            CTR,
            CPC,
            Cost,
          });
        }

        const resp = await models.travellers.findOne({
          where: {
            refreshToken: me.refreshToken,
            userType: 2,
            status: 1,
          },
        });
        let iscpp = 1;
        if (resp) {
          iscpp = resp.iscpp;
        }
        const data = {
          chartData: FollowersData,
          iscpp,
          Revenue: RevenueData,
        };
        return data;
      } catch (error) {
        throw new UserInputError(error);
      }
    },
  },

  Mutation: {
    influencerSignIn: async (
      parent,
      { email, password },
      { models, secret }
    ) => {
      try {
        const promise = new Promise((resolve, reject) => {
          firebaseLogin(email, password, (err, res) => {
            if (err) {
              reject(new AuthenticationError(err));
            }
            resolve(res);
          });
        });
        const checkUid = await models.travellers.findOne({
          where: { status: 1, refreshToken: await promise, userType: 2 },
        });
        if (checkUid !== null) {
          let tokens = createToken(checkUid, secret, '12h');
          return { token: tokens };
        } else {
          throw new UserInputError(authAPI.email_no_exists);
        }
      } catch (error) {
        throw new UserInputError(error);
      }
    },
    cppRequestByToken: async (parent, args, { models, me }) => {
      try {
        if (!me) {
          throw new AuthenticationError(authAPI.auth_failed);
        }
        const checkValid = await models.travellers.findOne({
          where: { refreshToken: me.refreshToken, userType: 2 },
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
              duplicating: false,
            },
          ],
          group: ['travellers.id'],
          raw: true,
        });
        if (checkValid) {
          let todayFormat = new Date().toISOString().slice(0, 10);
          if (checkValid.iscpp === 3) {
            const today = new Date(new Date().toISOString().split('T')[0]);
            const cdate = new Date(checkValid.rejectDate);
            const Difference_In_Time = today.getTime() - cdate.getTime();
            var Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);
            if (Difference_In_Days >= 30) {
              if (checkValid.FollowersCount > 2 && checkValid.watchtime > 4) {
                const data = { iscpp: 2, requestDate: todayFormat };
                await models.travellers.update(data, {
                  where: { refreshToken: me.refreshToken, userType: 2 },
                });
                const msg = {
                  status: authAPI.success,
                  code: authAPI.codeSuccess,
                  message: messageAPI.cppSuccess,
                };
                return msg;
              } else {
                const msg = {
                  status: authAPI.error,
                  code: authAPI.codeError,
                  message: messageAPI.cpperror,
                };
                return msg;
              }
            } else {
              const msg = {
                status: authAPI.error,
                code: authAPI.codeError,
                message: messageAPI.cpperrordays,
              };
              return msg;
            }
          }
          if (checkValid.FollowersCount > 1000 && checkValid.watchtime > 4000) {
            const data = { iscpp: 2, requestDate: todayFormat };
            await models.travellers.update(data, {
              where: { refreshToken: me.refreshToken, userType: 2 },
            });
            const msg = {
              status: authAPI.success,
              code: authAPI.codeSuccess,
              message: messageAPI.cppSuccess,
            };
            return msg;
          } else {
            const data = { iscpp: 2, rejectDate: todayFormat };
            await models.travellers.update(data, {
              where: { refreshToken: me.refreshToken, userType: 2 },
            });
            const msg = {
              status: authAPI.error,
              code: authAPI.codeError,
              message: messageAPI.cpperror,
            };
            return msg;
          }
        } else {
          const msg = {
            status: authAPI.error,
            code: authAPI.no_data,
            message: messageAPI.no_data,
          };
          return msg;
        }
      } catch (error) {
        throw new UserInputError(error);
      }
    },
    cppRequest: async (parent, { id, iscpp }, { models }) => {
      try {
        const checkValid = await models.travellers.findOne({
          where: { id, userType: 2 },
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
              duplicating: false,
            },
          ],
          group: ['travellers.id'],
          raw: true,
        });
        if (checkValid) {
          let todayFormat = new Date().toISOString().slice(0, 10);
          if (iscpp === 0 && checkValid.iscpp === 3) {
            const today = new Date(new Date().toISOString().split('T')[0]);
            const cdate = new Date(checkValid.rejectDate);
            const Difference_In_Time = today.getTime() - cdate.getTime();
            var Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);
            if (Difference_In_Days > 30) {
              if (checkValid.FollowersCount > 2 && checkValid.watchtime > 4) {
                const data = { iscpp, requestDate: todayFormat };
                await models.travellers.update(data, {
                  where: { id, userType: 2 },
                });
                const msg = {
                  status: authAPI.success,
                  code: authAPI.codeSuccess,
                  message: messageAPI.cppSuccess,
                };
                return msg;
              } else {
                const data = { iscpp: 3, rejectDate: todayFormat };
                await models.travellers.update(data, {
                  where: { id, userType: 2 },
                });
                const msg = {
                  status: authAPI.error,
                  code: authAPI.codeError,
                  message: messageAPI.cpperror,
                };
                return msg;
              }
            } else {
              const msg = {
                status: authAPI.error,
                code: authAPI.codeError,
                message: messageAPI.cpperrordays,
              };
              return msg;
            }
          }
          if (checkValid.FollowersCount > 1000 && checkValid.watchtime > 4000) {
            const data = { iscpp, requestDate: todayFormat };
            await models.travellers.update(data, {
              where: { id, userType: 2 },
            });
            const msg = {
              status: authAPI.success,
              code: authAPI.codeSuccess,
              message: messageAPI.cppSuccess,
            };
            return msg;
          } else {
            const data = { iscpp: 3, rejectDate: todayFormat };
            await models.travellers.update(data, {
              where: { id, userType: 2 },
            });
            const msg = {
              status: authAPI.error,
              code: authAPI.codeError,
              message: messageAPI.cpperror,
            };
            return msg;
          }
        } else {
          const msg = {
            status: authAPI.error,
            code: authAPI.no_data,
            message: messageAPI.no_data,
          };
          return msg;
        }
      } catch (error) {
        throw new UserInputError(error);
      }
    },
    VideoPrivacy: async (parent, { id, isprivate }, { models }) => {
      try {
        const data = { isprivate };
        const resp = await models.videos.update(data, { where: { id } });
        return resp;
      } catch (error) {
        throw new UserInputError(error);
      }
    },
  },
};

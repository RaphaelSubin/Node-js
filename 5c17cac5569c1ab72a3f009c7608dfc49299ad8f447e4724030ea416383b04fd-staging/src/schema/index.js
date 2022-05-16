/* eslint-disable linebreak-style */
// eslint-disable-next-line linebreak-style
/* eslint-disable import/no-duplicates */
/* eslint-disable linebreak-style */
import { gql } from 'apollo-server-express';
import AdminuserSchema from '../admin/schema/user';
import AdmintravellersSchema from '../admin/schema/travellers';
import AdmincategorySchema from '../admin/schema/category';
import AdminsubCategorySchema from '../admin/schema/subCategory';
import AdmincmsDataSchema from '../admin/schema/cmsData';
import AdminRolesSchema from '../admin/schema/roles';
import AdminpromotionSchema from '../admin/schema/promotion';
import AdminadsManagerSchema from '../adsmanager/schema/adsManager';
import AdminadsHotelSchema from '../admin/schema/hotel';
import AdminadsBokingsSchema from '../admin/schema/bookings';
import QrcodeSchema from '../admin/schema/qrCode';
import countrySchema from '../admin/schema/country';
import templatesSchema from '../admin/schema/templates';
import campaignSchema from '../admin/schema/campaign';
import AdsSchema from '../admin/schema/ads';
import Moduleschema from '../admin/schema/module';
import Permissionschema from '../admin/schema/permission';
import MainMenuschema from '../admin/schema/mainMenu';
import dashboardSchema from '../admin/schema/dashboard';
import influencerSchema from '../influencer/schema/influencers';
import travellerSchema from './travellers';
import userCategorySchema from './userCategory';
import categorySchema from './category';
import subCategorySchema from './subCategory';
import videoSchemas from './videos';
import commentSchema from './comment';
import likeSchema from './likes';
import cmsDataSchema from './cmsData';
import settingsSchema from './settings';
import broadcastSchema from './broadcast';
import bookingsSchema from './bookings';
import followersSchema from './followers';
import userWalletSchema from './userWallet';
import activitySchema from './activities';
import notificationSchema from './notifications';
import userSettingsSchema from './userSettings';
// eslint-disable-next-line import/no-duplicates
import userLevelSchema from './userLevel';
// eslint-disable-next-line import/no-duplicates
// eslint-disable-next-line no-unused-vars
import userLevel from './userLevel';

const linkSchema = gql`
  scalar Date
  type Query {
    _: Boolean
  }

  type Mutation {
    _: Boolean
  }

  type Subscription {
    _: Boolean
  }
`;

// eslint-disable-next-line max-len
export default [
  linkSchema,
  travellerSchema,
  userCategorySchema,
  categorySchema,
  subCategorySchema,
  cmsDataSchema,
  videoSchemas,
  commentSchema,
  likeSchema,
  AdminuserSchema,
  AdmintravellersSchema,
  AdmincategorySchema,
  AdminsubCategorySchema,
  AdmincmsDataSchema,
  AdminRolesSchema,
  AdminpromotionSchema,
  AdminadsManagerSchema,
  AdminadsHotelSchema,
  AdminadsBokingsSchema,
  QrcodeSchema,
  dashboardSchema,
  influencerSchema,
  countrySchema,
  templatesSchema,
  campaignSchema,
  AdsSchema,
  Moduleschema,
  Permissionschema,
  MainMenuschema,
  settingsSchema,
  broadcastSchema,
  bookingsSchema,
  followersSchema,
  userWalletSchema,
  activitySchema,
  notificationSchema,
  userSettingsSchema,
  userLevelSchema,
];

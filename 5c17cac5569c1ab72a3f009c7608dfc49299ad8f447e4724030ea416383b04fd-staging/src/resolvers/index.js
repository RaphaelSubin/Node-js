import { GraphQLDateTime } from 'graphql-iso-date';
import AdminuserResolvers from '../admin/resolvers/user';
import AdmintravellersResolvers from '../admin/resolvers/travellers';
import AdminadsmangerResolvers from '../adsmanager/resolvers/adsManager';
import AdmincategoryResolvers from '../admin/resolvers/category';
import AdminsubCategoryResolvers from '../admin/resolvers/subCategory';
import AdmincmsDataResolvers from '../admin/resolvers/cmsData';
import AdminRoleResolvers from '../admin/resolvers/roles';
import AdminpromotionResolvers from '../admin/resolvers/promotion';
import AdminHotelResolvers from '../admin/resolvers/hotel';
import AdminBookingsResolvers from '../admin/resolvers/bookings';
import QrCodeResolvers from '../admin/resolvers/qrCode';
import CountryResolvers from '../admin/resolvers/country';
import TemplatesResolvers from '../admin/resolvers/templates';
import CampaignResolvers from '../admin/resolvers/campaign';
import dashboardResolvers from '../admin/resolvers/dashboard';
import influencerResolvers from '../influencer/resolvers/influeners';
import AdsResolvers from '../admin/resolvers/ads';
import ModuleResolvers from '../admin/resolvers/module';
import PermissionResolvers from '../admin/resolvers/permission';
import mainMenuResolvers from '../admin/resolvers/mainMenu';
import travellersResolvers from './travellers';
import UserCategory from './userCategory';
import category from './category';
import subCategory from './subCategory';
import videos from './videos';
import comment from './comment';
import likes from './likes';
import cmsData from './cmsData';
import settings from './settings';
import broadcast from './broadcast';
import bookings from './bookings';
import followers from './followers';
import userWallet from './userWallet';
import activities from './activities';
import notifications from './notifications';
import userSettings from './userSettings';
import userLevel from './userLevel';

const customScalarResolver = {
  Date: GraphQLDateTime,
};

// eslint-disable-next-line max-len
export default [
  customScalarResolver,
  travellersResolvers,
  UserCategory,
  category,
  subCategory,
  cmsData,
  videos,
  comment,
  likes,
  AdminuserResolvers,
  AdmintravellersResolvers,
  AdmincategoryResolvers,
  AdminsubCategoryResolvers,
  AdmincmsDataResolvers,
  AdminRoleResolvers,
  AdminpromotionResolvers,
  AdminadsmangerResolvers,
  AdminHotelResolvers,
  AdminBookingsResolvers,
  QrCodeResolvers,
  influencerResolvers,
  dashboardResolvers,
  CountryResolvers,
  TemplatesResolvers,
  CampaignResolvers,
  AdsResolvers,
  ModuleResolvers,
  mainMenuResolvers,
  PermissionResolvers,
  settings,
  broadcast,
  bookings,
  followers,
  userWallet,
  activities,
  notifications,
  userSettings,
  userLevel,
];

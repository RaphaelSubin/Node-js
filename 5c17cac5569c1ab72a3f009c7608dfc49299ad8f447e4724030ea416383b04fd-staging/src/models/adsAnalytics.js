/* eslint-disable linebreak-style */
const adsAnalytics = (sequelize, DataTypes) => {
  const AdsAnalytics = sequelize.define('adsAnalytics', {
    viewCount: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
    },
    viewId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    impression: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    clicks: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    watchtime: {
      type: DataTypes.FLOAT,
      allowNull: true,
      defaultValue: 0,
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
      comment: '1- Active, 0- Inactive, 2- deleted',
    },
  });

  AdsAnalytics.associate = (models) => {
    AdsAnalytics.belongsTo(models.travellers, {
      foreignKey: 'InfluencerId',
      as: 'travellers',
    });
    AdsAnalytics.belongsTo(models.ads, {
      foreignKey: 'adsId',
      as: 'ads',
    });
    AdsAnalytics.belongsTo(models.campaign, {
      foreignKey: 'campaignId',
      as: 'campaign',
    });
  };

  return AdsAnalytics;
};

export default adsAnalytics;

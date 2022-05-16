const videosAnalytics = (sequelize, DataTypes) => {
  const VideosAnalytics = sequelize.define('videosAnalytics', {
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

  VideosAnalytics.associate = (models) => {
    VideosAnalytics.belongsTo(models.travellers, {
      foreignKey: 'InfluencerId',
      as: 'travellers',
    });
    VideosAnalytics.belongsTo(models.videos, {
      foreignKey: 'videoId',
      as: 'videos',
    });
  };

  return VideosAnalytics;
};

export default videosAnalytics;

/* eslint-disable linebreak-style */
/* eslint-disable key-spacing */
/* eslint-disable linebreak-style */
const videos = (sequelize, DataTypes) => {
  // eslint-disable-next-line no-shadow
  const videos = sequelize.define('videos', {
    url: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    thumbnail: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lat: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    lng: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    place: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    caption: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    commentCount: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
    },
    likeCount: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
    },
    isprivate : {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 1,
      comment: '1- Public, 0- Private',
    },
    viewCount: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
    },
    shareCount: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
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

  videos.associate = (models) => {
    videos.belongsTo(models.travellers, {
      foreignKey: 'userId',
      as: 'travellers',
    });
    videos.belongsTo(models.subCategory, {
      foreignKey: 'subCategoryId',
      as: 'subCategory',
    });
    videos.belongsTo(models.category, {
      foreignKey: 'categoryId',
      as: 'category',
    });
    videos.hasMany(models.likes, {
      foreignKey: 'videoId',
      as: 'likes',
    });
  };

  return videos;
};

export default videos;

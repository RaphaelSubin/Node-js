const likes = (sequelize, DataTypes) => {
  // eslint-disable-next-line no-shadow
  const likes = sequelize.define('likes', {
    status: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
      comment: '1- Like, 2- Unlike',
    },
  });

  likes.associate = (models) => {
    likes.belongsTo(models.travellers, {
      foreignKey: 'travellersId',
      as: 'traveller',
    });
    likes.belongsTo(models.videos, {
      foreignKey: 'videoId',
      as: 'video',
    });
  };

  return likes;
};

export default likes;

const comments = (sequelize, DataTypes) => {
  // eslint-disable-next-line no-shadow
  const comments = sequelize.define('comments', {
    comment: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    replyCount: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    likeCount: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
      comment: '1- Active, 0- Inactive',
    },
  });

  comments.associate = (models) => {
    comments.belongsTo(models.travellers, {
      foreignKey: 'travellersId',
      as: 'traveller',
    });
    comments.belongsTo(models.videos, {
      foreignKey: 'videoId',
      as: 'video',
    });
    comments.belongsTo(models.comments, {
      foreignKey: 'commentId',
      as: 'parentId',
    });
    comments.hasMany(models.commentLikes, {
      foreignKey: 'commentId',
      as: 'commentLikes',
    });
  };

  return comments;
};

export default comments;

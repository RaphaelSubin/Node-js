const commentLikes = (sequelize, DataTypes) => {
  // eslint-disable-next-line no-shadow
  const commentLikes = sequelize.define('commentLikes', {
    status: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
      comment: '1- Like, 2- Unlike',
    },
  });

  commentLikes.associate = (models) => {
    commentLikes.belongsTo(models.travellers, {
      foreignKey: 'travellersId',
      as: 'traveller',
    });
    commentLikes.belongsTo(models.comments, {
      foreignKey: 'commentId',
      as: 'comments',
    });
  };

  return commentLikes;
};

export default commentLikes;

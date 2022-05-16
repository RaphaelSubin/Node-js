const notifications = (sequelize, DataTypes) => {
  const notifications = sequelize.define('notifications', {
    sourceType: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    type: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    read: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
    },
    trash: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 1,
    },
  });

  notifications.associate = (models) => {
    notifications.belongsTo(models.travellers, {
      foreignKey: 'userId',
      as: 'to',
    });
    notifications.belongsTo(models.travellers, {
      foreignKey: 'notifiedUserId',
      as: 'from',
    });
    notifications.belongsTo(models.templates, {
      foreignKey: 'templateId',
      as: 'templates',
    });
    notifications.belongsTo(models.videos, {
      foreignKey: 'videoId',
      as: 'videos',
    });
  };

  return notifications;
};
export default notifications;

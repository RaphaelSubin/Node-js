const userSettings = (sequelize, DataTypes) => {
    // eslint-disable-next-line no-shadow
    const userSettings = sequelize.define('userSettings', {
  
      notificationSound: {
        type: DataTypes.INTEGER,
        defaultValue: 1,
        comment: '1- ON, 0- OFF',
      },
      notificationTone: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      notificationVibrate: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      callTone: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      callVibrate: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      status: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
        comment: '1- Active, 0- Inactive, 2- deleted',
      },
    });
  
    userSettings.associate = (models) => {
        userSettings.belongsTo(models.travellers, {
        foreignKey: 'travellersId',
        as: 'travellers',
      });
    };
  
    return userSettings;
  };
  
  export default userSettings;
  
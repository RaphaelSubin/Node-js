const userLevel = (sequelize, DataTypes) => {
    // eslint-disable-next-line no-shadow
    const userLevel = sequelize.define('userLevel', {
  
      userLevel: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: true,
      },
      status: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
        comment: '1- Active, 0- Inactive, 2- deleted',
      },
    });
  
    userLevel.associate = (models) => {
      userLevel.belongsTo(models.travellers, {
        foreignKey: 'travellersId',
        as: 'travellers',
      });
    };
  
    return userLevel;
  };
  
  export default userLevel;
  
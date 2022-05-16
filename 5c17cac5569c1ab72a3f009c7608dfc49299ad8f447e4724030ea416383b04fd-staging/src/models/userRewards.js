const userRewards = (sequelize, DataTypes) => {
    // eslint-disable-next-line no-shadow
    const userRewards = sequelize.define('userRewards', {
        name: {
            type: DataTypes.STRING,
            defaultValue: 0,
            allowNull: true,
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        userRewards: {
            type: DataTypes.FLOAT,
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
  
    userRewards.associate = (models) => {
      userRewards.belongsTo(models.travellers, {
        foreignKey: 'travellersId',
        as: 'travellers',
      });
    };
  
    return userRewards;
  };
  
  export default userRewards;
  
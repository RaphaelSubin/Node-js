
const userWallet = (sequelize, DataTypes) => {
    // eslint-disable-next-line no-shadow
    const userWallet = sequelize.define('userWallet', {
  
      points: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      amount: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      totalAmount: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      status: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
        comment: '1- Active, 0- Inactive, 2- deleted',
      },
    });
  
    userWallet.associate = (models) => {
      userWallet.belongsTo(models.travellers, {
        foreignKey: 'travellersId',
        as: 'travellers',
      });
    };
  
    return userWallet;
  };
  
  export default userWallet;
  
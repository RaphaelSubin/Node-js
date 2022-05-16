const adsPayment = (sequelize, DataTypes) => {
  const AdsPayment = sequelize.define('adsPayment', {
    transactionId: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    paymentId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    paymentDate: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 0,
    },
    Amount: {
      type: DataTypes.DOUBLE,
      allowNull: false,
    },
    cardType: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: '1- Debit, 2-credit',
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
      comment: '1- Active, 0- Inactive 2-deleted',
    },
  });
  AdsPayment.associate = (models) => {
    AdsPayment.belongsTo(models.adsManager, {
      foreignKey: 'adsManagerId',
      as: 'adsManager',
    });
  };
  return AdsPayment;
};
export default adsPayment;

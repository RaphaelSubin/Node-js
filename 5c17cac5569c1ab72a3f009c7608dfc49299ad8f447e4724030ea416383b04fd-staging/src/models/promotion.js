const promotion = (sequelize, DataTypes) => {
  const Promotion = sequelize.define('promotion', {
    voucherCode: {
      type: DataTypes.STRING,
      unique: false,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    voucherName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    voucherDesc: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    voucherType: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    discountType: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    offerValue: {
      type: DataTypes.DOUBLE,
      allowNull: true,
    },
    minAmount: {
      type: DataTypes.DOUBLE,
      allowNull: true,
    },
    discountCap: {
      type: DataTypes.DOUBLE,
      allowNull: true,
    },
    qty: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    custLimt: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    startDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    endDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    isNewuser: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 1,
      comment: '1- Active, 0- Inactive, 2- Deleted',
    },
  });
  return Promotion;
};
export default promotion;

const qrCode = (sequelize, DataTypes) => {
  const QrCode = sequelize.define('qrCode', {
    UniqeID: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    refreshToken: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    qrImage: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    isLogin: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'false',
      comment: 'true- logged , false- not Login',
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
      comment: '1- Active, 0- Inactive 2-deleted',
    },
  });

  return QrCode;
};
export default qrCode;

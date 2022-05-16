const adsManager = (sequelize, DataTypes) => {
  const AdsManager = sequelize.define('adsManager', {
    username: {
      type: DataTypes.STRING,
      unique: false,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    displayName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    businessName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    website: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    contactPerson: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    services: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    about: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      validate: {
        notEmpty: true,
        isEmail: true,
      },
    },
    profilePic: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    refreshToken: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    lockWallet: {
      type: DataTypes.DOUBLE,
      allowNull: true,
    },
    Wallet: {
      type: DataTypes.DOUBLE,
      allowNull: true,
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },
  });
  AdsManager.associate = (models) => {
    AdsManager.belongsTo(models.country, {
      foreignKey: 'countryId',
      as: 'country',
    });
    AdsManager.hasMany(models.adsPayment, {
      foreignKey: 'adsManagerId',
    });
    AdsManager.hasMany(models.activeCampaign, {
      foreignKey: 'adsManagerId',
    });
  };
  return AdsManager;
};
export default adsManager;

/* eslint-disable linebreak-style */
const campaign = (sequelize, DataTypes) => {
  const Campaign = sequelize.define('campaign', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    object: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    country: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
      comment: '0- global 1-countries',
    },
    ageGroup: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    gender: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    budget: {
      type: DataTypes.DOUBLE,
      allowNull: true,
    },
    paymentType: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: '1- monthly, 2-one time',
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
      comment: '1- Active, 0- Inactive 2-deleted',
    },
  });
  Campaign.associate = (models) => {
    Campaign.hasMany(models.campaignCategory, {
      foreignKey: 'campaignId',
      as: 'campaignCategory',
    });
    Campaign.hasMany(models.campaignState, {
      foreignKey: 'campaignId',
      as: 'campaignState',
    });
    Campaign.belongsTo(models.campaign, {
      foreignKey: 'adsManagerId',
      as: 'adsManager',
    });
  };
  return Campaign;
};
export default campaign;

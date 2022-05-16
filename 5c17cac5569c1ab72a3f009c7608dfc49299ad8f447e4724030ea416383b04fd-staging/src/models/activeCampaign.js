/* eslint-disable linebreak-style */
const activeCampaign = (sequelize, DataTypes) => {
  const ActiveCampaign = sequelize.define('activeCampaign', {
    startDate: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    endDate: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    budget: {
      type: DataTypes.DOUBLE,
      allowNull: true,
    },
    usage: {
      type: DataTypes.DOUBLE,
      allowNull: true,
    },
    clicks: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    views: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    impress: {
      type: DataTypes.INTEGER,
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
  ActiveCampaign.associate = (models) => {
    ActiveCampaign.belongsTo(models.adsManager, {
      foreignKey: 'adsManagerId',
      as: 'adsManager',
    });
    ActiveCampaign.belongsTo(models.campaign, {
      foreignKey: 'campaignId',
      as: 'campaign',
    });
  };
  return ActiveCampaign;
};
export default activeCampaign;

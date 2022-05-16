/* eslint-disable linebreak-style */
const ads = (sequelize, DataTypes) => {
  const Ads = sequelize.define('ads', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    videofile: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    displayName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    url: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    cta: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
      comment: '1- Active, 0- Inactive 2-deleted',
    },
  });
  Ads.associate = (models) => {
    Ads.belongsTo(models.campaign, {
      foreignKey: 'campaignId',
      as: 'campaign',
    });
  };
  return Ads;
};
export default ads;

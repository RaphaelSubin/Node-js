const campaignCategory = (sequelize) => {
  const CampaignCategory = sequelize.define('campaignCategory', {});

  CampaignCategory.associate = (models) => {
    CampaignCategory.belongsTo(models.campaign, {
      foreignKey: 'campaignId',
      as: 'campaign',
    });
    CampaignCategory.belongsTo(models.category, {
      foreignKey: 'categoryId',
      as: 'category',
    });
  };

  return CampaignCategory;
};

export default campaignCategory;

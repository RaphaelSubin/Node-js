const campaignState = (sequelize) => {
  const CampaignState = sequelize.define(
    'campaignState',
    {},
    {
      timestamps: false,
    }
  );
  CampaignState.associate = (models) => {
    CampaignState.belongsTo(models.campaign, {
      foreignKey: 'campaignId',
      as: 'campaign',
    });
    CampaignState.belongsTo(models.states, {
      foreignKey: 'stateId',
      as: 'state',
    });
  };

  return CampaignState;
};

export default campaignState;

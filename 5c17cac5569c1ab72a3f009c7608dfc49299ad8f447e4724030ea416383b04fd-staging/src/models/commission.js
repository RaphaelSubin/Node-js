const commission = (sequelize, DataTypes) => {
  const Commission = sequelize.define('commission', {
    viewAmount: {
      type: DataTypes.FLOAT,
      allowNull: true,
      defaultValue: 0,
    },
    clickAmount: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    watchtimeAmount: {
      type: DataTypes.FLOAT,
      allowNull: true,
      defaultValue: 0,
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
      comment: '1- Active, 0- Inactive, 2- deleted',
    },
  });

  Commission.associate = (models) => {
    Commission.belongsTo(models.user, {
      foreignKey: 'userId',
      as: 'users',
    });
  };

  return Commission;
};

export default commission;

const module = (sequelize, DataTypes) => {
  const Module = sequelize.define('module', {
    moduleName: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    display: {
      type: DataTypes.STRING,
    },
    priority: {
      type: DataTypes.INTEGER,
    },
    isMenu: {
      type: DataTypes.INTEGER,
    },
    url: {
      type: DataTypes.STRING,
    },
    icon: {
      type: DataTypes.STRING,
    },
    hasOwnLink: {
      type: DataTypes.INTEGER,
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 1,
      comment: '1- Active, 0- Inactive, 2- Deleted',
    },
  });
  Module.associate = (models) => {
    Module.belongsTo(models.mainMenu, {
      foreignKey: 'mainMenuId',
      as: 'mainMenu',
    });
  };
  return Module;
};
export default module;

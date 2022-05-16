const permission = (sequelize) => {
  const Permission = sequelize.define('permission', {});
  Permission.associate = (models) => {
    Permission.belongsTo(models.roles, {
      foreignKey: 'roleId',
      as: 'roles',
    });
    Permission.belongsTo(models.module, {
      foreignKey: 'moduleId',
      as: 'module',
    });
  };

  return Permission;
};
export default permission;

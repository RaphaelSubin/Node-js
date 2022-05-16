const roles = (sequelize, DataTypes) => {
  const Roles = sequelize.define('roles', {
    userType: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },
  });

  return Roles;
};
export default roles;

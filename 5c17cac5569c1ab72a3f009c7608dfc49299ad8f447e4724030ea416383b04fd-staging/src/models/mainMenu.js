const mainMenu = (sequelize, DataTypes) => {
  const MainMenu = sequelize.define('mainMenu', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 1,
      comment: '1- Active, 0- Inactive, 2- Deleted',
    },
  });

  return MainMenu;
};
export default mainMenu;

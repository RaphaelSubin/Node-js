const states = (sequelize, DataTypes) => {
  const States = sequelize.define(
    'states',
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      countryid: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
    },
    {
      timestamps: false,
    },
  );
  return States;
};
export default states;

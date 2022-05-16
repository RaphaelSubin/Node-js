const country = (sequelize, DataTypes) => {
  const Country = sequelize.define(
    'country',
    {
      sortname: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      name: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      phonecode: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
    },
    {
      timestamps: false,
    },
  );

  return Country;
};
export default country;

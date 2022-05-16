const user = (sequelize, DataTypes) => {
  const User = sequelize.define('user', {
    username: {
      type: DataTypes.STRING,
      unique: false,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    displayName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      validate: {
        notEmpty: true,
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        len: [6, 42],
      },
    },
    profilePic: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    userType: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    refreshToken: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },
  });
  User.associate = (models) => {
    User.belongsTo(models.roles, {
      foreignKey: 'userType',
      as: 'roles',
    });
  };

  User.findByLogin = async (login) => {
    let userOne = await User.findOne({
      where: { username: login },
    });
    if (!userOne) {
      userOne = await User.findOne({
        where: { email: login },
      });
    }
    return userOne;
  };

  return User;
};
export default user;

const travellers = (sequelize, DataTypes) => {
  // eslint-disable-next-line no-shadow
  const travellers = sequelize.define('travellers', {
    firstName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    screenName: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: true,
    },
    emailId: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: true,
    },
    countryCode: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    phone: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    dob: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    gender: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    profilePic: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    loginType: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    socialId: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: true,
    },
    fcmToken: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    refreshToken: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: true,
    },
    stripe_id: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    user_lat: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    user_lng: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    resetToken: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    point: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
    },
    viewcount: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
    },
    sharecount: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
    },
    watchtime: {
      type: DataTypes.FLOAT,
      allowNull: true,
      defaultValue: 0,
    },
    userlevel: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
    },
    userType: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 1,
    },
    iscpp: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
      comment: '1- not a member, 0- Accepted, 2- Requested, 3- Rejected',
    },
    requestDate: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    country: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    state: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    rejectDate: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 1,
    },
    language: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 2,
      comment: '1- Chinese, 2- English, 3- Japanese',
    },
  });
  travellers.associate = (models) => {
    travellers.hasMany(models.videos, {
      foreignKey: 'userId',
      as: 'videos',
    });
    travellers.hasMany(models.followers, {
      foreignKey: 'travellersId',
      as: 'follower',
    });
    travellers.hasMany(models.videosAnalytics, {
      foreignKey: 'viewId',
      as: 'videosAnalytics',
    });
  };
  travellers.findByLogin = async (login) => {
    let userOne = await travellers.findOne({
      where: { refreshToken: login },
    });
    if (!userOne) {
      userOne = await travellers.findOne({
        where: { refreshToken: login },
      });
    }
    return userOne;
  };

  return travellers;
};
export default travellers;

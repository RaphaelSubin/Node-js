/* eslint-disable linebreak-style */
const settings = (sequelize, DataTypes) => {
  const Settings = sequelize.define('settings', {
    name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    smtpHost: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    smtpUser: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    smtpPassword: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    smtpPort: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    adminEmail: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    logo: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  });
  return Settings;
};
export default settings;

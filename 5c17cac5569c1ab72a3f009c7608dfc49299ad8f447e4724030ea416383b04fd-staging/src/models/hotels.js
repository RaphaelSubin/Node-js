/* eslint-disable linebreak-style */
/* eslint-disable no-shadow */
/* eslint-disable linebreak-style */
const hotels = (sequelize, DataTypes) => {
  const hotels = sequelize.define('hotels', {
    hotelId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    hotelName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    address: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    lat: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    lng: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    place: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    image: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
      comment: '1- Active, 0- Inactive 2-deleted',
    },
  });
  hotels.associate = (models) => {
    hotels.hasMany(models.bookings, {
      foreignKey: 'hotelId',
      as: 'bookings',
    });
  };
  return hotels;
};
export default hotels;

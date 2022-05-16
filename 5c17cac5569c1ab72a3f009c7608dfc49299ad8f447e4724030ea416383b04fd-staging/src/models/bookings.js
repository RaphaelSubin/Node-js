const bookings = (sequelize, DataTypes) => {
  const bookings = sequelize.define('bookings', {
    bookingId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    customerName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    customerPhone: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    totalAmount: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    bookedDate: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    checkInDate: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    checkOutDate: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    promoApplied: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      comment: '1- yes, 0- no',
    },
    discount: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    referenceId: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    isCancelled: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      comment: '1- yes, 0- no',
    },
    stateStatus: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      comment: '1- yes, 0- no',
    },
    userStatus: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      comment: '1- yes, 0- no',
    },
    roomType: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    addons: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    noRooms: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    totalPrice: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    tax: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    addonsCharge: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    orderPrice: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    isRated: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      comment: '1- Rated, 0- not rated ',
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
      comment: '1- Active, 0- Inactive 2-deleted',
    },
  });

  bookings.associate = (models) => {
    bookings.belongsTo(models.travellers, {
      foreignKey: 'travellersId',
      as: 'travellers',
    });
    bookings.belongsTo(models.hotels, {
      foreignKey: 'hotelId',
      as: 'hotels',
    });
    bookings.belongsTo(models.promotion, {
      foreignKey: 'promotionId',
      as: 'promotion',
    });
  };
  return bookings;
};
export default bookings;

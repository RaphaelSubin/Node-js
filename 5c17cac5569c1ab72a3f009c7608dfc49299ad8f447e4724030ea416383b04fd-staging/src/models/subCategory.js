const subCategory = (sequelize, DataTypes) => {
  const SubCategory = sequelize.define('subCategory', {
    subName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    subImage: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
      comment: '1- Active, 0- Inactive, 2-deleted',
    },
  });

  SubCategory.associate = (models) => {
    SubCategory.belongsTo(models.category, {
      foreignKey: 'catId',
      as: 'category',
    });
  };

  return SubCategory;
};
export default subCategory;

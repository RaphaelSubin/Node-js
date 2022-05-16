const userCategory = (sequelize, DataTypes) => {
    const userCategory = sequelize.define('userCategory', {
      subCategoryId: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      status: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
        comment: '1- Active, 0- Inactive',
      },
    });
  
    userCategory.associate = (models) => {
        userCategory.belongsTo(models.travellers, {
        foreignKey: 'userId',
        as: 'travellers',
      });
      // userCategory.belongsTo(models.subCategory, {
      //   foreignKey: 'subCategoryId',
      //   as: 'subCategory',
      // });
      userCategory.belongsTo(models.category, {
        foreignKey: 'categoryId',
        as: 'category',
      });
    };

  return userCategory;
};

export default userCategory;

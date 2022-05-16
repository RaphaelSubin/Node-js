const category = (sequelize, DataTypes) => {
  const Category = sequelize.define('category', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    avatar: {
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
  Category.associate = (models) => {
    Category.hasMany(models.videos, {
      foreignKey: 'categoryId',
    });
  };
  return Category;
};
export default category;

'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Recipe extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Recipe.init({
    userId:DataTypes.INTEGER,
    title: DataTypes.STRING,
    ingredients: DataTypes.STRING,
    direction: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Recipe',
  });
  Recipe.associate = function(models) {
    Recipe.belongsTo(models.User)
  }
  return Recipe;
};
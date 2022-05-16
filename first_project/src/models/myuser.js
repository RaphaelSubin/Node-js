const { Sequelize, DataTypes, Model } = require('sequelize');
import { sequelize } from '../../models';

class UserModel extends Model {}

UserModel.init({
  // Model attributes are defined here
  firstName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  lastName: {
    type: DataTypes.STRING
    // allowNull defaults to true
  }
}, {
  // Other model options go here
  sequelize, // We need to pass the connection instance
  modelName: 'UserModel' // We need to choose the model name
});

// the defined model is the class itself
console.log(UserModel === sequelize.models.UserModel); // true

module.exports=UserModel;
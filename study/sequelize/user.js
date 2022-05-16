const sequelize = require("./database/db");
const Sequelize = require("sequelize");
const employee = sequelize.define("employee", {
  name: {
    type: Sequelize.DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: Sequelize.DataTypes.STRING,
    allowNull: false,
  },
  age: {
    type: Sequelize.DataTypes.INTEGER,
    defaulValue: 18,
  },
});

employee
  .sync()
  .then(() => {
    console.log("user synced successfully");
  })
  .catch((err) => {
    console.log("error", err.message);
  });

module.exports = employee;

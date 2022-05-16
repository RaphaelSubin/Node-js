const Sequelize = require("sequelize");
//const user = require('./user');
const sequelize = new Sequelize("sample_sequelize_db", "postgres", "", {
  host: "localhost",
  port: 8082,
  dialect: "postgres",
});

module.exports = sequelize;

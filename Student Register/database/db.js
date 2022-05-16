const Sequelize = require('sequelize');

const sequelize = new Sequelize('student_management','postgres','',{
    port:8082,
    dialect:'postgres'
});

module.exports = sequelize;
const Sequelize = require("sequelize");
const express = require('express')
const app = express();
const sequelize = require("./database/db");
const router = require('./router/router')
const employee = require("./user");
//const user = require('./user');

// async function myFunction () {
//         await sequelize.authenticate();
//     console.log('connection successful');

// }

// myFunction();
//app.use('/api',router)



// console.log('another task');

const user = sequelize.define("user", {
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

user
  .sync({ alter: true })
  .then(() => {
    console.log("user synced successfully");
    //const User = user.create({ name: "baby", email: "asd@125", age: 32 });
    //return User.save();
    return user.findAll({attributes:['name','age']});
  })
  .then((data) => {
    //console.log("datas added to database");
    console.log(data);
  })
  .catch((err) => {
    console.log("error", err.message);
  });

// (async () => {
//   const Emp = await employee.create({
//     name: "baby",
//     email: "asd@125",
//     age: 32,
//   });
//   Emp.save();
// })();

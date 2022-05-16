const db = require("../models");
const Student = db.student;

var root = {
  userDetails: (args) => {
    console.log(args);
    Student.findAll().then((data) => {
      console.log("data", JSON.stringify(data));
      return data[0];
    });
    // return [
    //   {
    //     name: "subin",
    //     username: "subinnm",
    //     age: 21,
    //     password: "subin password",
    //   },
    //   {
    //     name: "antony",
    //     username: "subinnm",
    //     age: 25,
    //     password: "skdcnkjsd",
    //   },
    // ];
  },
};

module.exports = root;

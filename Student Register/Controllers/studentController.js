//const nodemailer = require("nodemailer");
const db = require("../models");
const Student = db.student;

// const transporter = nodemailer.createTransport({
//   host: "gmail",
//   auth: {
//     user: "subinviju2000@gmail.com",
//     pass: "Inception@123",
//   },
// });

exports.register = function (req, res) {
  console.log(req.body);
  const items = {
    name: req.body.name,
    username: req.body.username,
    password: req.body.password,
    age: req.body.age,
    place: req.body.place,
  };
  Student.create(items)
    .then(() => {
          res.send("datas added successfully");
        
    })
}
// .then(() => {
    //   transporter.sendMail({
    //     from: "subinviju2000@gmail.com",
    //     to: "subinviju2000@gmail.com",
    //     subject: "Test Email Subject",
    //     html: "<h1>Student registered successfully</h1>",
    //   });
    // })


exports.userDetails = (req, res) => {
  let page = req.query.page;
  let size = req.body.size
  if (!page) {
    page = 1;
  }
  if (!size) {
    size = 3;
  }
  // const limit = parseInt(size);
  // const skip = (page - 1) * size;
  Student.findAll({
    limit: size,
    offset: (page * size)
  })
    .then((data) => {
      res.send({
        page,
        size,
        data
      });
    })
    .catch((err) => {
      console.log("Error", err.message);
    });
};

exports.getName = (req, res) => {
  Student.findAll({
    attributes: ["place", "name"],
  })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      console.log("Error", err.message);
    });
};

const express = require("express");
const { sequelize, Sequelize } = require("./models");
const db = require("./models");
const op = Sequelize.Op;
const User = db.user;
const jwt = require("jsonwebtoken");
const res = require("express/lib/response");
const router = express.Router();

router.post("/sign-up", (req, res, next) => {
  console.log(req.body);
  const user = {
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    phoneNo: req.body.phoneNo,
    password: req.body.password,
  };

  User.create(user)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred!",
      });
    });
});

router.post("/login", async (req, res) => {
  const userCheck = await User.findOne({
    where: {
      [op.and]: {
        email: req.body.email ?? "",
        password: req.body.password ?? "",
      },
    },
  });
  if (!userCheck) {
    res.send("invalid user/password");
    throw new Error("email/password is not valid");
  }

  const token = jwt.sign(
    {
      id: userCheck.id,
      firstName: userCheck.firstName,
      lastName: userCheck.lastName,
      email: userCheck.email,
      phoneNo: userCheck.phoneNo,
      password: userCheck.password,
    },
    process.env.SECRET,
    { expiresIn: "1y" }
  );

  const { password, ...userDetails } = userCheck.dataValues;
  res.send({ status: 200, data: userDetails, msg: "logged In", token: token });
});

router.get("/getData", async (req, res) => {
  const data = await User.findAll()
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      throw err;
    });
});

router.put("/update-data", async (req, res) => {
  console.log(req.body);
  const user = await User.findOne({ where: { id: req.body.id } });
  if (!user) {
    throw new Error("error");
  }

  user.firstName = req.body.firstName;
  user.lastName = req.body.lastName;
  user.email = req.body.email;
  user.phoneNo = req.body.phoneNo;
  await user.save();
  res.send(user);
});

router.get("/secret-data", async (req, res) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, process.env.SECRET);
    req.userData = await User.findOne({ where: { id: decoded.id } });
    console.log(req.userData);
    res.send({
      data: req.userData,
      msg: "logged In",
    });
  } catch (err) {
    return res.status(401).send({
      msg: "Your session is not valid!",
    });
  }
});

module.exports = router;

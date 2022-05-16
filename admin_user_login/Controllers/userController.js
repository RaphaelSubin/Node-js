const db = require("../models");
const users = db.user;
const {Op} = require('sequelize')

module.exports = {
  userRegistration: (req, res) => {
    const type = 2;
    const status = 1;

    const userItems = {
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      type: type,
      status: status,
    };

    users
      .create(userItems)
      .then((data) => {
        res.send({ msg: "user Registered Successfully" });
      })
      .catch((Err) => {
        console.log(Err.message);
      });
  },

  isLoggedIn: async (req, res) => {
    findUser = async (req, res) => {
      const resp = await users.findOne({
        where: { name: req.body.name, email: req.body.email },
        raw: true,
      });
      return resp;
    };

    const user = await findUser(req);

    if (user) {
      console.log(user.type);
      if (user.type == 1 && user.status == 1) {
        users.findAll({where : {email : {[Op.not] : 'admin@123'}}}).then((data) => {
          res.send({ msg: "Admin Logged..", data: data });
        });
      } else if(user.type == 2 && user.status == 1) {
          res.send("Successfully logged In");
        } else if (user.type == 2 && user.status == 0) {
          users.findOne({ where: { email: user.email } }).then(() => {
            res.send("user logged wait for admin approval...");
          });
        } else {
          res.send("invalid user!");
        }
      
    }
  },
};

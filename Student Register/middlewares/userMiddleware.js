const db = require("../models");
const Student = db.student;

async function getUser(req) {
  const resp = await Student.findOne({
    where: { username: req.body.username },
    //raw: true,
  });
  console.log("inside");
  return resp;
}
module.exports = {
  validation: async (req, res, next) => {
    if (!req.body.username || req.body.username.length < 3) {
      return res
        .status(400)
        .send({ msg: "Enter username with atleast 3 characters" });
    }

    if (!req.body.password || req.body.password.length < 4) {
      return res.status(400).send({
        msg: "Enter password with atleast 4 characters",
      });
    }

    next();
  },

  username: async (req, res, next) => {
    const user1 = await getUser(req);
    console.log("skjdckjsd");
    if (user1) {
      res.status(400).send({
        msg: "Username already exist",
      });
      return;
    }
    next();
  },

  // checkUsername : (req,res,next) => {
  //     Student.findOne({where : {username : req.body.username}, raw : true}).then((resp)=>{
  //       if(resp){
  //             res.status(400).send('Username already exists')

  //              next()
  //        }
  //     }).catch((() => {
  //         try {
  //           throw new Error('BROKEN')
  //         } catch (err) {
  //           next(err)
  //         }

  //     }))
  // }
};

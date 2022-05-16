const db = require('../models')
const users = db.user;

module.exports = {
    userValidation :async (req,res,next) => {
        if(!req.body.password || req.body.password.length < 3){
           return res.status(400).send({msg :'password must be atleast 3 characters'})
        }

        next()
    },


    checkEmail : (req,res,next) => {
        const Email = getEmail(req);
        if(Email){
           return res.status(400).send({msg :'Email already exists!'})
        }

        next();
    },

    isLoggedIn : (req,res,next) => {
        const Name = getName(req);
        if(!Name){
          return  res.send({msg : 'User not Registered..'})
        }

        next();
    }
    
}

async function getEmail (req,res) {
   const resp = await users.findOne({where : {email :req.body.email} })
   return resp;
}

async function getName(req){
    const resp = await users.findOne({where : {name : req.body.name}})
    return resp;
 }
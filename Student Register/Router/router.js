const express = require('express');
const router = express.Router();
const studentController = require('../Controllers/studentController')
const userMiddleware = require('../middlewares/userMiddleware')


router.get('/',(req,res)=>{
    res.send('registration form')
})

router.post('/registration', userMiddleware.validation,userMiddleware.username, studentController.register);

router.get('/userDetails', studentController.userDetails);

router.get('/getNameAndPlace', studentController.getName)

module.exports = router;
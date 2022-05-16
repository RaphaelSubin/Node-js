const express = require('express')
const router = express.Router();
const userController = require('./Controllers/userController')
const userMiddleware = require('./Middlewares/userMiddleware')


router.post('/registration',userMiddleware.userValidation,userMiddleware.checkEmail,userController.userRegistration)

router.post('/userlogin',userController.isLoggedIn)


module.exports = router;
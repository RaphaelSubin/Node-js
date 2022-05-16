const express = require('express');
const router = express.Router();
const user = require('../user')



router.get('/api',(req,res)=> {
    res.send(user.findAll())
    next()
})


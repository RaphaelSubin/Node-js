const express = require('express')
const app = express()
const genres = require('./routers/genres')
const home = require('./routers/home')

app.use('/vidley.com/api/genres', genres)
app.use('/', home)

const port = process.env.PORT || 5000

app.listen(port ,(req,res) => {
    console.log('running');
})
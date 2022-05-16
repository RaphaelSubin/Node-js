const express = require('express')
const { append } = require('express/lib/response')

const app = express()
app.use(express.json())

const {sequelize, User} = require('./models')


app.post('/Users',async(req,res) => {
    const {name, email, role} = req.body


try{
    const user = await User.create({name,email,role})

    return res.json(user)
}catch(err){
    console.log(err);
    return res.status(404).json(err)
}

} )



app.listen({port:5000}, async () => {
console.log('server running on localhost:5000');
  await sequelize.sync()
  console.log('database synced');
})

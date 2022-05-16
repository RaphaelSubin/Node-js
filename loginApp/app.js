const express = require('express')
const app = express();
const cors = require('cors')


//port setup
const  PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

//adding router
const router = require('./routers/router')
app.use('/api', router);


//server run
app.listen(PORT, ()=> console.log(`server running on port ${PORT}`));


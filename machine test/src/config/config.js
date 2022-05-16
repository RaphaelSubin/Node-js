require('dotenv').config()
const DBdetails ={
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    port:process.env.DB_PORT,    
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    dialect: "postgres"
  }

  module.exports = {
    development:DBdetails
  }
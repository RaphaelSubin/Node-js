require('dotenv').config()
const dbDetails = {
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  host: process.env.DB_HOST,
  dialect: 'postgres'
}
module.exports = {
  development: dbDetails,
  production: dbDetails
}



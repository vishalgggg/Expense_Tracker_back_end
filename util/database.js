const { Sequelize } = require('sequelize')


const sequelize = new Sequelize('expensetracker1', process.env.DB_USERNAME, '', {
    dialect: "mysql",
    host: process.env.DB_HOST,
    logging: false
})



module.exports = sequelize
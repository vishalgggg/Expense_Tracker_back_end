const Sequelize = require('sequelize')
const sequelize = require('../util/database')


const downloadExpensesModel = sequelize.define("donwloadExpenses", {
    id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
    },
    date: Sequelize.STRING,
    time: Sequelize.STRING,
    downloadLink: Sequelize.STRING,
})

module.exports = downloadExpensesModel


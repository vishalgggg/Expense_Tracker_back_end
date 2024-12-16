const Sequelize = require('sequelize')
const sequelize = require('../util/database')

const expenseModel = sequelize.define("expenses", {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,

    },
    date: {
        type: Sequelize.STRING,
        allowNull: false
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    price: {
        type: Sequelize.STRING,
        allowNull: false
    },
    category: {
        type: Sequelize.STRING,
        allowNull: false
    },

})

module.exports = expenseModel
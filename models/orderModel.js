const sequelize = require('../util/database')
const Sequelize = require('sequelize')

const orderModel = sequelize.define("orders", {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,

    },
    paymentId: Sequelize.STRING,
    orderId: Sequelize.STRING,
    status: Sequelize.STRING,


})

module.exports = orderModel
const Sequelize = require('sequelize')
const sequelize = require('../util/database')

const userModel = sequelize.define('users', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true

    },
    userName: {
        type: Sequelize.STRING,
        allowNull: false
    },
    userEmail: {
        type: Sequelize.STRING,
        allowNull: false
    },
    userPhone: {
        type: Sequelize.STRING,
        allowNull: false
    },
    userPwd: {
        type: Sequelize.STRING,
        allowNull: false

    },
    totalTransaction: {
        type: Sequelize.STRING
    },

    isPremiumUser: Sequelize.BOOLEAN

})

module.exports = userModel
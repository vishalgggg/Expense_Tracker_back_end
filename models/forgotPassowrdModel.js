const sequelize = require('../util/database')
const Sequelize = require('sequelize')


const forgotPasswordModel = sequelize.define('forgotpwdrequest', {
    isActive: Sequelize.BOOLEAN,
    id: {
        type: Sequelize.STRING,
        primaryKey: true
    },

})

module.exports = forgotPasswordModel
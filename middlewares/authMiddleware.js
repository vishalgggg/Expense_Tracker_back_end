const userModel = require('../models/userModel')
const { decodeToken } = require('../helperFunctions')
const bcrypt = require('bcrypt')


const authMiddleware = async (req, res, next) => {
    try {
        const { token } = req.headers
        if (token) {
            const { email, password } = decodeToken(token)
            const user = await userModel.findOne({ where: { userEmail: email } })
            const verifyPwd = await bcrypt.compare(password, user.userPwd)
            if (verifyPwd) {
                req.user = user
                next()
            }
            else {
                res.status(400).send({ message: 'some error occured' })
            }

        }
    } catch (error) {
        console.log(error)
        res.status(400).send({ message: 'some error occured' })
    }
}


module.exports = authMiddleware
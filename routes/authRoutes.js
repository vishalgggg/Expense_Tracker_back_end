const { onUserLogin, onUserSignUp, authenticateUser, onUserForgotPassword, showForgotPasswordForm, updatePassword } = require('../controllers/authController')
const express = require('express')

const router = express.Router()

router.post('/authenticateuser', authenticateUser)

router.post('/signup', onUserSignUp)

router.post('/login', onUserLogin)

router.post('/forgotpassword', onUserForgotPassword)

router.get('/showforgotpasswordform/:id', showForgotPasswordForm)

router.get('/updatepassword/:id', updatePassword)




module.exports = router
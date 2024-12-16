const { generateToken, decodeToken } = require('../helperFunctions')
const userModel = require('../models/userModel')
const forgotPwdModel = require("../models/forgotPassowrdModel")
const bcrypt = require('bcrypt')
const sib = require("sib-api-v3-sdk")
const { v4: uuidv4 } = require('uuid');
require('dotenv').config()

const authController = {

    authenticateUser: async (req, res) => {
        const token = req.body.token
        try {
            if (token) {
                const { email, password } = decodeToken(token)
                const findUser = await userModel.findAll({ where: { userEmail: email } })
                const match = await bcrypt.compare(password, findUser[0].userPwd)

                if (match) {
                    res.send({ status: "User verfied" })
                } else {
                    res.status(400).send({ message: "Error ! log in again " })
                }
            } else {
                res.status(400).send({ message: "Error ! log in again " })
            }

        } catch (error) {

        }
    },


    onUserSignUp: async (req, res) => {
        const { userName, userEmail, userPhone, userPwd } = req.body

        try {
            const findusers = await userModel.findAll({ where: { userEmail: userEmail } })
            const finduser = findusers[0]
            if (finduser) {
                res.status(400).send({ message: "User Exist", });
            }

            else {
                const hashPwd = await bcrypt.hash(userPwd, 10)
                const createdUser = await userModel.create({ userName, userEmail, userPhone, userPwd: hashPwd })
                if (createdUser) {
                    const token = generateToken(userEmail, userPwd)
                    res.send({ status: "Success", token: token })
                }
            }

        } catch (error) {
            console.log(error)
            res.status(400).send({ message: error })
        }

    },

    onUserLogin: async (req, res) => {
        const { userEmail, userPwd } = req.body

        try {
            if (userEmail && userPwd) {
                const findedUsers = await userModel.findAll({ where: { userEmail: userEmail } })
                const findedUser = findedUsers[0]

                // if user found then we have to check the password

                if (findedUser) {
                    const match = await bcrypt.compare(userPwd, findedUser.userPwd);
                    if (match) {
                        const token = generateToken(userEmail, userPwd)
                        res.send({ status: "success", message: "successfully login", token: token })
                    }
                    else {
                        res.status(400).send({ message: "Wrong Password" })
                    }
                }
                else {
                    res.status(404).send({ message: "User does not exist" })
                }
            }
        } catch (error) {
            res.status(500).send({ message: error })
        }

    },
    onUserForgotPassword: async (req, res) => {
        const { email } = req.body;

        try {
            const user = await userModel.findOne({ where: { userEmail: email } })

            if (user) {
                const id = user.id
                const client = sib.ApiClient.instance;
                const apiKey = client.authentications['api-key'];
                apiKey.apiKey = process.env.SENDINBLUE_API_KEY;
                const transEmailApi = new sib.TransactionalEmailsApi();

                // sender and receivers
                const sender = { email: "admin@budgetbuddy.com" };
                const receivers = [{ email }];
                const uniqueString = uuidv4()
                await forgotPwdModel.create({ isActive: true, id: uniqueString, userId: id })
                await transEmailApi.sendTransacEmail({
                    sender,
                    to: receivers,
                    subject: "Forgot Password From BudgetBuddy",
                    htmlContent: `<a href= /auth/showforgotpasswordform/${uniqueString}>Update Password</a>`
                });
                res.status(200).json({ message: 'Password reset email sent successfully.' });
            }
            else {
                res.status(400).send({ message: "User Not Found !" })
            }

        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Internal server error.' });
        }
    },
    showForgotPasswordForm: async (req, res) => {
        const { id } = req.params
        if (id) {
            try {
                const forgotPwdRequest = await forgotPwdModel.findOne({ where: { id: id } })
                console.log(forgotPwdRequest)
                if (forgotPwdRequest.isActive) {
                    await forgotPwdRequest.update({ isActive: false })
                    res.status(200).send(`<html>
                    <form action="/auth/updatepassword/${id}" method="get">
                        <label for="newpassword">Enter New password</label>
                        <input name="newpassword" type="password" required></input>
                        <button>reset password</button>
                    </form>
                </html>`)
                }
                else {
                    res.status(200).send(`<html>
                    <h1>Forgot Password link expire</h1>
                    <h1>Please genarate a fresh request</h1>
                </html>`)
                }
            } catch (error) {
                console.log(error)
                res.status(400).send({ message: "some thing went Wrong" })
            }
        }
    },
    updatePassword: async (req, res) => {
        const { id } = req.params
        const { newpassword } = req.query
        try {
            const generatedUser = await forgotPwdModel.findOne({ where: { id: id } })
            const user = await userModel.findOne({ where: { id: generatedUser.userId } })
            const hashPwd = await bcrypt.hash(newpassword, 10)
            await user.update({ userPwd: hashPwd })
            res.send("<h1>Your Passowrd sucessfully updated</h1>")
        } catch (error) {
            console.log(error)
            res.status(400).send({ message: "something went wrong" })
        }
    }

}

module.exports = authController

// /auth/upadateforgotpassword


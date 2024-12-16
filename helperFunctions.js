require('dotenv').config()
const jwt = require("jsonwebtoken")


// helper function to encode email,password 

const generateToken = (email, password) => {
    return jwt.sign({ email, password }, process.env.JWT_SECRET)
}

// helper function to decode the jwt token
const decodeToken = (token) => {
    return jwt.verify(token, process.env.JWT_SECRET)
}

// exporting 
module.exports = { generateToken, decodeToken }



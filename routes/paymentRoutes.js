const express = require('express')
const authMiddleware = require('../middlewares/authMiddleware')
const { buyPremium, updatePremiumStatus, updateStausToFailed } = require('../controllers/paymentController')

const router = express.Router()

router.post('/buypremium', authMiddleware, buyPremium)
router.post('/updatepremiumstatus', authMiddleware, updatePremiumStatus)
router.post('/updatepremiumstatustofailed', authMiddleware, updateStausToFailed)

module.exports = router
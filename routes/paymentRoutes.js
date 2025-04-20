const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const authMiddleware = require('../middlewares/authMiddleware')
// Define routes
router.post('/buyPremium',authMiddleware, paymentController.buyPremium);
router.get('/updatepremiumstatus/:orderId',authMiddleware, paymentController.updatePremiumStatus);
// router.post('/updatepremiumstatustofailed', paymentController.updateStausToFailed);
router.get('/getpremiumStatus',authMiddleware, paymentController.getPremiumStatus);
module.exports = router;
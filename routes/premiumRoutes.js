const express = require("express")
const authMiddleware = require('../middlewares/authMiddleware')
const { getLeaderBoard, downlaodExpenses, getAllDownloadLinks } = require('../controllers/premiumController')
const router = express.Router()

router.get('/getleaderboard', getLeaderBoard)
router.get('/downloadexpenses', authMiddleware, downlaodExpenses)
router.get('/alldownlaodlinks', authMiddleware, getAllDownloadLinks)

module.exports = router
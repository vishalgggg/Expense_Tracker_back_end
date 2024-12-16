const userModel = require('../models/userModel')
const downloadExpensesModel = require('../models/donwloadExpensesModel')
const { uploadtoS3 } = require('../services/S3services')


const premiumController = {
    getLeaderBoard: async (req, res) => {

        try {
            const findLeaderBoard = await userModel.findAll({
                attributes: ["id", 'userName', 'totalTransaction'],
                order: [['totalTransaction', 'DESC']]
            });

            res.status(200).send(findLeaderBoard)

        } catch (error) {
            res.status(500).send('Internal Server Error');
        }
    },


    // to get the expenses in downlad format 
    downlaodExpenses: async (req, res) => {
        try {
            const expenses = await req.user.getExpenses()
            const stringifyExpenses = JSON.stringify(expenses)
            const filename = `expenses${req.user.id}${new Date().toString()}.txt`
            const downloadLink = await uploadtoS3(stringifyExpenses, filename)

            // saving to database 
            const date = new Date().toLocaleDateString()
            const time = new Date().toLocaleTimeString()
            const createdLink = await downloadExpensesModel.create({ date, time, downloadLink, userId: req.user.id })
            res.status(200).json({ downloadLink, date, time, id: createdLink.id, success: true })

        } catch (error) {
            console.log(error)
            res.status(500).send({ message: "Something went Wrong", error: error })
        }
    },

    // to get all downloadlinks
    getAllDownloadLinks: async (req, res) => {
        const { id } = req.user
        try {
            const fetchDownLoadLinks = await downloadExpensesModel.findAll({ where: { userId: id } })
            res.send(fetchDownLoadLinks)

        } catch (error) {
            res.status(500).send({ message: "something went wrong while fetching all downlaod links" })
        }
    }
}


module.exports = premiumController

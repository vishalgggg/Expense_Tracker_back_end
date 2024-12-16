const expenseModel = require('../models/expenseModel')
const sequelize = require("../util/database")


const expenseController = {
    // when user add some expense 
    addExpense: async (req, res) => {
        const { date, name, price, category } = req.body
        const { id, totalTransaction } = req.user
        let t;
        try {
            // crating the transaction object 
            t = await sequelize.transaction()
            const userId = id
            const addedExpense = await expenseModel.create({ date, name, price, category, userId, }, { transaction: t })
            const oldTransactions = Number(totalTransaction)
            const currAmount = Number(price)
            const updateTotalTransaction = await req.user.update({ totalTransaction: oldTransactions + currAmount }, { transaction: t })
            res.send({ staus: "Success", id: addedExpense.id, totalTransaction: updateTotalTransaction })
            await t.commit()
        } catch (error) {
            console.log(error)
            await t.rollback()
            res.status(400).send({ message: "error try again !" })
        }
    },


    // when user want to fecth all expenses 
    getExpense: async (req, res) => {
        const { rowsperpage, page } = req.query
        const { userEmail, id, isPremiumUser, totalTransaction } = req.user
        try {
            if (userEmail && id) {
                const allExpenses = await expenseModel.findAll({ where: { userId: id } })
                const startIndex = (page - 1) * rowsperpage
                const endIndex = page * rowsperpage
                const slicedExpense = allExpenses.slice(startIndex, endIndex)
                const userExpenses = {
                    expenses: slicedExpense,
                    expensesLength: allExpenses.length,
                    isPremiumUser,
                    totalTransaction
                }
                res.send(userExpenses)

            }
        } catch (error) {
            console.log(error)
            res.status(400).send({ message: "error while getting the expenses" })
        }
    },


    // when user want to delete his/her expense 
    deleteExpense: async (req, res) => {
        const id = req.body.id
        let t;
        try {
            if (id) {
                // crating the transaction object 
                t = await sequelize.transaction()
                const findedExpenses = await expenseModel.findOne({ where: { id: id } })
                const totalTransaction = Number(req.user.totalTransaction)
                const expenseAmount = Number(findedExpenses.price)
                const deletedRes = await findedExpenses.destroy({ transaction: t })
                await req.user.update({ totalTransaction: totalTransaction - expenseAmount }, { transaction: t })
                res.send({ status: "Delete Success", id: deletedRes.id })
                await t.commit()
            }
        } catch (error) {
            await t.rollback()
            res.staus(400).send({ message: "Error while deleting the expense" })
        }
    }

}



module.exports = expenseController


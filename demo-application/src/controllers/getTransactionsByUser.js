const getTxByUser = require('../db/queries/getTransactionsByUser')

const getTransactionsByUser = async (req, res, next) => {

    try {
        const userName = req.userName
        const transactions = await getTxByUser(userName)
        if (transactions.length) {
            res.status(200).json(transactions)

        } else {
            res.status(200).json({
                msg: 'No transactions found'
            })
        }
    } catch (err) {
        next(err)
    }


}

module.exports = getTransactionsByUser
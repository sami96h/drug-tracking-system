const getTxByUser = require('../db/queries/getTransactionsByUser')


const getTransactionsByUser = async (req, res, next) => {

	try {
		const {orgMspId} = req.user
		const transactions = await getTxByUser(orgMspId)
        
		if (transactions.length) {
			res.status(200).json(transactions)

		} else {
			res.status(200).json({
				msg: 'No data found'
			})
		}
	} catch (err) {
		next(err)
	}


}

module.exports = getTransactionsByUser
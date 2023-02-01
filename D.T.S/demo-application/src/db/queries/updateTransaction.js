const Transaction = require('../models/transactions')


const updateTransaction = async (transactionId, data) => {

	return await Transaction.findOneAndUpdate(
		{ transactionId: transactionId },
		{ $set: data }
	)


}

module.exports = updateTransaction


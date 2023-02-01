const Transaction = require('../models/transactions')

const getTxByUser = async (orgMspId) => {

	return await Transaction.find({ orgMsp:orgMspId })
		.select('transactionName transactionId batchId status error')
		.sort({_id: -1})
		.lean()
		.exec()
}


module.exports=getTxByUser


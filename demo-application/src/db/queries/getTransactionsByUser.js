const Transaction = require('../models/transactions')

const getTxByUser = async (userName) => {

    return await Transaction.find({ userName: userName }).select('transactionName transactionId batchId status').lean().exec();
}


module.exports=getTxByUser


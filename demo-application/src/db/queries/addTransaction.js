const Transaction = require('../models/transactions')


const addTransaction= async(transactionData)=>{

return await Transaction.create(
   transactionData
);

}

module.exports=addTransaction


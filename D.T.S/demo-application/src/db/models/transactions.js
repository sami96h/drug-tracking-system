const mongoose = require('mongoose')

const transactionSchema = new mongoose.Schema({
	status: {
		type: String,
		required: true
	},
	batchId: {
		type: String,
		required: false
	},
	transactionId: {
		type: String,
		required: true,
		unique: true
	},
	payload: {
		type: Object,
		required: false
	},
	error: {
		type: String,
		required: false
	},
	transactionName
	:{
		type:String,
		required:true
	},
	userName: {
		type: String,
		required: true
	},
	orgMsp: {
		type: String,
		required: true
	}
})

const Transaction = mongoose.model('Transaction', transactionSchema)

module.exports = Transaction
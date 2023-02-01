
const Fabric = require('../fabric')


class BatchController {


	static createBatch = async (req, res, next) => {
		const { orgMspId } = req.user
		const submitQueue = req.app.locals.jobq
		const {batchId,medicineName,pricePerBox,productionDate,expiryDate,amount} = req.body

		try {
			await submitQueue.add('createBatch', {
				transactionArgs:{
					batchId,
					data:JSON.stringify({medicineName,pricePerBox,productionDate,expiryDate,amount})
				},
				mspId: orgMspId
			})

			res.status(200).json({ msg: 'Your transaction is being processed.' })
		}
		catch (err) {
            
			next(err)
		}
	}

	static getBatch = async (req, res, next) => {
		const batchId = req.params.Id

		const fabric = new Fabric(req.user.orgMspId, req.app.locals)
		const contract = fabric.org.contracts.assetContract

		try {
			const data = await fabric.evatuateTransaction(

				'getBatch',
				contract,
				batchId
			)
			// console.log(JSON.parse( Buffer.from(JSON.parse(data).drug.payload).toString()))
			if (!data.message) {
				res.json({ data: JSON.parse(data.toString()) })
			} else {
				res.json({ message: data.message })
			}

		}
		catch (err) {
			next(err)
		}

	}

	static checkBatchExistence = async (req, res, next) => {
		const batchId = req.params.Id
        
		const fabric = new Fabric(req.user.orgMspId, req.app.locals)

		try {
			const data = await fabric.evatuateTransaction(

				'batchExist',
				batchId
			)

			res.status(200).json({ message: data.toString() })


		}
		catch (err) {
			next(err)
		}

	}


	static updateBatch = async (req, res, next) => {
		const { orgMspId } = req.user
		const submitQueue = req.app.locals.jobq
		let transactionArgs = req.body
		let transactionName
		let newOwner
		try {
			if (orgMspId === 'Org3MSP') {
				transactionName = 'sellBox'

			} else
			if (Object.keys(transactionArgs).length === 1) {
				transactionName = 'transfer'
				switch (orgMspId) {
				case 'Org1MSP': newOwner = 'Org2MSP'
					break
				case 'Org2MSP': newOwner = 'Org3MSP'
					break
				default: return res.status(401).json({ msg: 'Unauthorized action' })
				}
				transactionArgs.newOwner = newOwner
			} else if ('vehicleId' in transactionArgs) {
				const {batchId,vehicleId,shipNo,receiptDate,deliveryDate}=transactionArgs
				transactionName = 'addDistributorData'
				const data={vehicleId,shipNo,receiptDate,deliveryDate}
				transactionArgs={batchId,data:JSON.stringify(data)}

			} else {
				throw new Error('Invalid transaction')
			}
        
			// batchId, newData
			await submitQueue.add(transactionName, {
				transactionArgs,
				mspId: orgMspId
			})

			res.status(200).json({ msg: 'Your transaction is being processed.' })
		}
		catch (err) {
			next(err)
		}
	}

	static deleteBatch = async (req, res, next) => {
		const batchId = req.params.Id
		const submitQueue = req.app.locals.jobq   // const transactionArgs = {batchId}
		const { orgMspId } = req.user

		try {
			await submitQueue.add('deleteBatch', {
				transactionArgs: { batchId },
				mspId: orgMspId
			})
			res.status(200).json({ msg: 'Your transaction is being processed.' })
		}
		catch (err) {
			next(err)
		}

	}

	static getAllBatches = async (req, res, next) => {

		const fabric = new Fabric(req.user.orgMspId, req.app.locals)
		const contract = fabric.org.contracts.assetContract
		try {
			const data = await fabric.evatuateTransaction(

				'getBatchesByOwner',
				contract

			)
			res.json({ data: JSON.parse(data.toString()) })
		}
		catch (err) {
			next(err)
		}

	}

	static getBatchHistory = async (req, res, next) => {
		const batchId = req.params.Id
        

		const fabric = new Fabric(req.user.orgMspId, req.app.locals)
		const contract = fabric.org.contracts.assetContract

		try {
			const data = await fabric.evatuateTransaction(

				'getBatchHistory',
				contract,
				batchId
			)

			res.json({ data: JSON.parse(data.toString()) })
		}
		catch (err) {
			next(err)
		}

	}
	static test = async(req, res,next)=>{
		const fabric = new Fabric(req.user.orgMspId, req.app.locals)
		const contract = fabric.org.contracts.drugsContract
		try {
			const data = await fabric.evatuateTransaction(

				'GetAllDrugs',
				contract
			)
			res.json({ data: JSON.parse(data.toString()) })
		}
		catch (err) {
			next(err)
		}


	}

}

module.exports = BatchController
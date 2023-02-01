const Fabric = require('../fabric')

class BoxesController {

	static getBox = async (req, res, next) => {

		const boxId = req.params.Id
		const fabric = new Fabric('Org1MSP',req.app.locals)
        
		await fabric.connect('user1')
		const contract = fabric.org.contracts.assetContract
        
		try {
			const data = await fabric.evatuateTransaction(
				'readBox',
				contract,
				boxId
			)
			if(!data.message){
				res.status(200).json({ data: JSON.parse(data.toString()) })

			}else{
				res.status(200).json({message:data.message})
			}
		}
		catch (err) {
			next(err)
		}
	}

	static getBoxesByBatch = async (req, res,next) => {
		const batchId = req.params.Id
		const fabric = new Fabric(req.user.orgMspId,req.app.locals)
		const contract = fabric.org.contracts.assetContract

		try {
			const data = await fabric.evatuateTransaction(
               
				'getBatchBoxes',
				contract,
				batchId
			)
			res.json({ data:JSON.parse(data.toString()) })
		}
		catch (err) {
			next(err)
		}
    
	}

	// static updateBox = async (req, res, next) => {
	// 	const fabric = new Fabric(req.user.orgMspId,req.app.locals)
    
	// 	const submitQueue = req.app.locals.jobq
	// 	const { boxId } = req.body
	// 	const batchId = boxId.slice(0, boxId.indexOf('.'))
	// 	try {
	// 		let oldData = await fabric.evatuateTransaction(
	// 			contract,
	// 			'getBatch',
	// 			batchId
	// 		)
	// 		await submitQueue.add('updateBatch', {
	// 			transactionArgs: {
	// 				batchId, oldData: oldData.toString(), stage: 'retailer', data: JSON.stringify({ boxId })
	// 			},
	// 			mspId: req.user
	// 		})
    
	// 		res.status(200).json({ msg: 'Your transaction is being processed.' })
	// 	}
	// 	catch (err) {
	// 		next(err)
	// 	}
	// }

}

module.exports=BoxesController
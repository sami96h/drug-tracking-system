const Fabric = require('../fabric')

class BoxesController {

    static fabric = () => {
        return new Fabric()
    }

    static getBox = async (req, res, next) => {
        const boxId = req.params.Id
        const contract = req.app.locals[req.user].contracts.assetContract

        try {
            const data = await evatuateTransaction(
                contract,
                'readBox',
                boxId
            )
            res.json({ data: JSON.parse(data.toString()) })
        }
        catch (err) {
            next(err)
        }

    }

    static getBoxesByBatch = async (req, res,next) => {
        const batchId = req.params.Id
        const contract = req.app.locals[req.user].contracts.assetContract
        try {
            const data = await evatuateTransaction(
                contract,
                'getBatchBoxes',
                batchId
            )
            res.json({ data:JSON.parse(data.toString()) })
        }
        catch (err) {
            next(err)
        }
    
    }

    static updateBox = async (req, res, next) => {
        const contract = req.app.locals[req.user].contracts.assetContract
    
        const submitQueue = req.app.locals['jobq']
        const { boxId } = req.body
        const batchId = boxId.slice(0, boxId.indexOf('.'))
        try {
            let oldData = await evatuateTransaction(
                contract,
                'getBatch',
                batchId
            )
            await submitQueue.add('updateBatch', {
                transactionArgs: {
                    batchId, oldData: oldData.toString(), stage: 'retailer', data: JSON.stringify({ boxId })
                },
                mspId: req.user
            })
    
            res.status(200).json({ msg: 'Your transaction is being processed.' })
        }
        catch (err) {
            next(err)
        }
    }

}

module.exports=BoxesController
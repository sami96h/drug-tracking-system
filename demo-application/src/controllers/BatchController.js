
const Fabric = require('../fabric')

class BatchController {
    static fabric = () => {
        return new Fabric()
    }

    static addBatch = async (req, res, next) => {
        const submitQueue = req.app.locals['jobq']
        const transactionArgs = req.body

        try {
            await submitQueue.add('createBatch', {
                transactionArgs,
                mspId: req.user
            })

            res.status(200).json({ msg: 'Your transaction is being processed.' })
        }
        catch (err) {
            next(err)
        }
    }

    static getBatch = async (req, res, next) => {
        const batchId = req.params.Id
        const contract = req.app.locals[req.user].contracts.assetContract
        try {
            const data = await this.fabric().evatuateTransaction(
                contract,
                'getBatch',
                batchId
            )
            res.json({ data: JSON.parse(data.toString()) })
        }
        catch (err) {
            next(err)
        }

    }

    static updateBatch = async (req, res, next) => {
        const contract = req.app.locals[req.user].contracts.assetContract
        const submitQueue = req.app.locals['jobq']
        const { batchId, data } = req.body
        // batchId, stage, data : {VehicleId ,Ship NO.  ,ReceiptDate ,DeliveryDate}


        try {
            const oldData = await this.fabric().evatuateTransaction(
                contract,
                'getBatch',
                batchId
            )

            await submitQueue.add('updateBatch', {
                transactionArgs: {
                    batchId, oldData: oldData.toString(), stage: 'distributer', data
                },
                mspId: req.user
            })

            res.status(200).json({ msg: 'Your transaction is being processed.' })
        }
        catch (err) {
            next(err)
        }
    }

    static deleteBatch = async (req, res, next) => {
        const batchId = req.params.Id
        const submitQueue = req.app.locals['jobq']   // const transactionArgs = {batchId}
        try {
            await submitQueue.add('deleteBatch', {
                transactionArgs: { batchId },
                mspId: req.user
            })
            res.status(200).json({ msg: 'Your transaction is being processed.' })
        }
        catch (err) {
            next(err)
        }

    }

    static getAllBatches = async (req, res, next) => {
        console.log(this.fabric())
        const contract = req.app.locals[req.user].contracts.assetContract
        try {
            const data = await this.fabric().evatuateTransaction(
                contract,
                'GetAllBatches'

            )
            res.json({ data: JSON.parse(data.toString()) })
        }
        catch (err) {
            next(err)
        }

    }

    static getBatchHistory = async (req, res, next) => {
        const batchId = req.params.Id
        const contract = req.app.locals[req.user].contracts.assetContract
        try {
            const data = await this.fabric().evatuateTransaction(
                contract,
                'getBatchHistory',
                batchId
            )
            res.json({ data: JSON.parse(data.toString()) })
        }
        catch (err) {
            next(err)
        }

    }

}

module.exports = BatchController
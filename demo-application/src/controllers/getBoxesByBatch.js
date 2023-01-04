const { evatuateTransaction } = require('../fabric')

const getBoxesByBatch = async (req, res) => {
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
        res.json({ err:err.message })
    }

}

module.exports=getBoxesByBatch

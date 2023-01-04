const { evatuateTransaction } = require('../fabric')

const getAsset = async (req, res) => {
    const batchId = req.params.Id
    const contract = req.app.locals[req.user].assetContract
    try {
        const data = await evatuateTransaction(
            contract,
            'getBatch',
            batchId
        )
        res.json({ data:JSON.parse(data.toString()) })
    }
    catch (err) {
        res.json({ err:err.message })
    }

}

module.exports=getAsset

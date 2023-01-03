const { evatuateTransaction } = require('../fabric')


const getAssetHistory = async (req, res) => {
    const batchId = req.params.Id
    const contract = req.app.locals[req.user].assetContract
    try {
        const data = await evatuateTransaction(
            contract,
            'getBatchHistory',
            batchId
        )
        res.status(200).json({ data:JSON.parse(data.toString()) })
    }
    catch (err) {
        res.json({ msg: 'fail' })
    }

}

module.exports=getAssetHistory

const { evatuateTransaction } = require('../fabric')

const getBox = async (req, res) => {
    const boxId = req.params.Id
    const contract = req.app.locals[req.user].contracts.assetContract

    try {
        const data = await evatuateTransaction(
            contract,
            'readBox',
            boxId
        )
        res.json({ data:JSON.parse(data.toString()) })
    }
    catch (err) {
        res.json({ err:err.message })
    }

}

module.exports=getBox

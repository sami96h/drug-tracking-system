


const addAsset = async (req, res) => {
    console.log(req.app.locals['Org1MSP'].assetContract.contractListeners)
    try {
        const { id } = req.body
        const contract = req.app.locals['Org1MSP'].assetContract
        const transaction = contract.createTransaction('createMyAsset');
        const payload = await transaction.submit(id, 'loool');

        res.json({ data: 'lool' })

    }
    catch (err) {
        res.json({ msg: 'holy shiy' })
    }

}
module.exports = addAsset
const addAsset = async (req, res) => {
   
    const submitQueue = req.app.locals['jobq']
    const transactionArgs = req.body
   
    try {
        const job = await submitQueue.add('createBatch', {transactionArgs,
        mspId:req.user
        })

        res.json({ msg: 'success', jobId: job.id })
    }
    catch (err) {
        res.json({ msg: err })
    }
}

module.exports = addAsset
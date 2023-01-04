const { Worker, Queue } = require('bullmq')
const config = require('./config')
const { submitTransaction } = require('./fabric')
const logger = require('./logger')
const Transaction = require('./db/models/transactions')
const updateTransaction = require('./db/queries/updateTransaction')
const addTransaction = require('./db/queries/addTransaction')


const connection = {
    port: config.redisPort,
    host: config.redisHost,
    username: config.redisUsername,
    password: config.redisPassword,
};

module.exports.initJobQueue = () => {
    const submitQueue = new Queue(
        config.JOB_QUEUE_NAME,
        {
            connection,
            defaultJobOptions: {
                attempts: config.submitJobAttempts,
                backoff: {
                    type: config.submitJobBackoffType,
                    delay: config.submitJobBackoffDelay,
                },
                removeOnComplete: config.maxCompletedSubmitJobs,
                removeOnFail: config.maxFailedSubmitJobs,
            },
        });

    return submitQueue;
};

module.exports.initJobQueueWorker = (app) => {
    const worker = new Worker(
        config.JOB_QUEUE_NAME,
        async (job) => {
            return await processSubmitTransactionJob(app, job);
        },
        { connection, concurrency: config.submitJobConcurrency }
    );

    worker.on('failed', (job) => {
        logger.warn({ job }, 'Job failed');
    });

    // Important: need to handle this error otherwise worker may stop
    // processing jobs
    worker.on('error', (err) => {

        logger.error({ err }, 'Worker error');
    });


    worker.on('completed', async (job) => {

        if (job.returnvalue.err) {
            await updateTransaction(job.returnvalue.transactionId, { error: job.returnvalue.err, status: 'invalid' })
        } else {
            await updateTransaction(job.returnvalue.transactionId, { payload: job.returnvalue.payload, status: 'valid' })

        }
    });


    return worker;
}


const processSubmitTransactionJob = async (app, job) => {
    const transactionName = job.name
    const contract = app.locals[job.data.mspId].contracts.assetContract
    const transaction = contract.createTransaction(transactionName);
    await addTransaction({
        status: 'pending',
        batchId: job.data.transactionArgs.batchId,
        transactionName: transactionName,
        orgMsp: job.data.mspId,
        transactionId: transaction.transactionId,

        userName: transaction.identityContext.user._name
    })
    const res = await submitTransaction(app, transaction, job)
    return res


}

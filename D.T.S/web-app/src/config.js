const env = require('env-var')

const ORG1 = 'Org1'
const ORG2 = 'Org2'
const ORG3 = 'Org3'

const JOB_QUEUE_NAME = 'submit'


const secretKey = env
	.get('SECRETKEY')
	.required()
	.default('too secret')
	.asString()


/**
 * Log level for the REST server
 */
const logLevel = env
	.get('LOG_LEVEL')
	.default('info')
	.asEnum(['fatal', 'error', 'warn', 'info', 'debug', 'trace', 'silent'])

/**
 * The port to start the REST server on
 */
const port = env
	.get('PORT')
	.default('3000')
	.example('3000')
	.asPortNumber()


/**
 * The type of backoff to use for retrying failed submit jobs
 */
const submitJobBackoffType = env
	.get('SUBMIT_JOB_BACKOFF_TYPE')
	.default('fixed')
	.asEnum(['fixed', 'exponential'])

/**
 * Backoff delay for retrying failed submit jobs in milliseconds
 */
const submitJobBackoffDelay = env
	.get('SUBMIT_JOB_BACKOFF_DELAY')
	.default('3000')
	.example('3000')
	.asIntPositive()

/**
 * The total number of attempts to try a submit job until it completes
 */
const submitJobAttempts = env
	.get('SUBMIT_JOB_ATTEMPTS')
	.default('5')
	.example('5')
	.asIntPositive()

/**
 * The maximum number of submit jobs that can be processed in parallel
 */
const submitJobConcurrency = env
	.get('SUBMIT_JOB_CONCURRENCY')
	.default('5')
	.example('5')
	.asIntPositive()

/**
 * The number of completed submit jobs to keep
 */
const maxCompletedSubmitJobs = env
	.get('MAX_COMPLETED_SUBMIT_JOBS')
	.default('1000')
	.example('1000')
	.asIntPositive()

/**
 * The number of failed submit jobs to keep
 */
const maxFailedSubmitJobs = env
	.get('MAX_FAILED_SUBMIT_JOBS')
	.default('1000')
	.example('1000')
	.asIntPositive()

/**
 * Whether to initialise a scheduler for the submit job queue
 * There must be at least on queue scheduler to handle retries and you may want
 * more than one for redundancy
 */
const submitJobQueueScheduler = env
	.get('SUBMIT_JOB_QUEUE_SCHEDULER')
	.default('true')
	.example('true')
	.asBoolStrict()

/**
 * Whether to convert discovered host addresses to be 'localhost'
 * This should be set to 'true' when running a docker composed fabric network on the
 * local system, e.g. using the test network otherwise should it should be 'false'
 */
const asLocalhost = env
	.get('AS_LOCAL_HOST')
	.default('true')
	.example('true')
	.asBoolStrict()

/**
 * The Org1 MSP ID
 */
const mspIdOrg1 = env
	.get('HLF_MSP_ID_ORG1')
	.default(`${ORG1}MSP`)
	.example(`${ORG1}MSP`)
	.asString()

const mspIdOrg2 = env
	.get('HLF_MSP_ID_ORG2')
	.default(`${ORG2}MSP`)
	.example(`${ORG2}MSP`)
	.asString()

const mspIdOrg3 = env
	.get('HLF_MSP_ID_ORG3')
	.default(`${ORG3}MSP`)
	.example(`${ORG3}MSP`)
	.asString()


/**
 * Name of the channel which the basic asset sample chaincode has been installed on
 */
const channelName = env
	.get('HLF_CHANNEL_NAME')
	.default('mychannel')
	.example('mychannel')
	.asString()

/**
 * Name used to install the basic asset sample
 */
const chaincode1Name = env
	.get('HLF_CHAINCODE_NAME')  // chaincode1Name chaincode2Name
	.default('batches-contract')
	.example('basic')
	.asString()

const chaincode2Name = env
	.get('HLF_CHAINCODE_NAME')
	.default('drugs-contract')
	.example('basic')
	.asString()

/**
 * The transaction submit timeout in seconds for commit notification to complete
 */
const commitTimeout = env
	.get('HLF_COMMIT_TIMEOUT')
	.default('300')
	.example('300')
	.asIntPositive()

/**
 * The transaction submit timeout in seconds for the endorsement to complete
 */
const endorseTimeout = env
	.get('HLF_ENDORSE_TIMEOUT')
	.default('30')
	.example('30')
	.asIntPositive()

/**
 * The transaction query timeout in seconds
 */
const queryTimeout = env
	.get('HLF_QUERY_TIMEOUT')
	.default('3')
	.example('3')
	.asIntPositive()

/**
 * The Org1 connection profile JSON
 */
const connectionProfileOrg1 = env
	.get('HLF_CONNECTION_PROFILE_ORG1')
	.required()
	.example(
		'{"name":"test-network-org1","version":"1.0.0","client":{"organization":"Org1" ... }'
	)
	.asJsonObject()

const connectionProfileOrg2 = env
	.get('HLF_CONNECTION_PROFILE_ORG2')
	.required()
	.example(
		'{"name":"test-network-org2","version":"1.0.0","client":{"organization":"Org2" ... }'
	)
	.asJsonObject()

const connectionProfileOrg3 = env
	.get('HLF_CONNECTION_PROFILE_ORG3')
	.required()
	.example(
		'{"name":"test-network-org3","version":"1.0.0","client":{"organization":"Org3" ... }'
	)
	.asJsonObject()


/**
 * Certificate for an Org1 identity to evaluate and submit transactions
 */
const userCer = env
	.get('HLF_CERTIFICATE_ORG1')
	.required()
	.example('"-----BEGIN CERTIFICATE-----\\n...\\n-----END CERTIFICATE-----\\n"')
	.asString()

const certificateOrg2 = env
	.get('HLF_CERTIFICATE_ORG2')
	.required()
	.example('"-----BEGIN CERTIFICATE-----\\n...\\n-----END CERTIFICATE-----\\n"')
	.asString()

const certificateOrg3 = env
	.get('HLF_CERTIFICATE_ORG3')
	.required()
	.example('"-----BEGIN CERTIFICATE-----\\n...\\n-----END CERTIFICATE-----\\n"')
	.asString()

/**
 * Private key for an Org1 identity to evaluate and submit transactions
 */
const userPrivateKey = env
	.get('HLF_PRIVATE_KEY_ORG1')
	.required()
	.example('"-----BEGIN PRIVATE KEY-----\\n...\\n-----END PRIVATE KEY-----\\n"')
	.asString()

const privateKeyOrg2 = env
	.get('HLF_PRIVATE_KEY_ORG2')
	.required()
	.example('"-----BEGIN PRIVATE KEY-----\\n...\\n-----END PRIVATE KEY-----\\n"')
	.asString()

const privateKeyOrg3 = env
	.get('HLF_PRIVATE_KEY_ORG3')
	.required()
	.example('"-----BEGIN PRIVATE KEY-----\\n...\\n-----END PRIVATE KEY-----\\n"')
	.asString()


/**
 * The host the Redis server is running on
 */
const redisHost = env
	.get('REDIS_HOST')
	.default('localhost')
	.example('localhost')
	.asString()

/**
 * The port the Redis server is running on
 */
const redisPort = env
	.get('REDIS_PORT')
	.default('6379')
	.example('6379')
	.asPortNumber()

/**
 * Username for the Redis server
 */
const redisUsername = env
	.get('REDIS_USERNAME')
	.example('fabric')
	.asString()

/**
 * Password for the Redis server
 */
const redisPassword = env.get('REDIS_PASSWORD').asString()

module.exports = {
	redisPassword,
	redisUsername,
	redisPort,
	redisHost,
	userPrivateKey,
	userCer,
	commitTimeout,

	connectionProfileOrg1,
	queryTimeout,
	endorseTimeout,
	  channelName, mspIdOrg1, asLocalhost
	,
	submitJobQueueScheduler, maxFailedSubmitJobs,
	maxCompletedSubmitJobs, submitJobConcurrency, submitJobAttempts,
	 submitJobBackoffDelay
	,
	submitJobBackoffType, port, logLevel, JOB_QUEUE_NAME,
	ORG1,
	chaincode1Name ,chaincode2Name,
	secretKey,
	mspIdOrg2, mspIdOrg3, connectionProfileOrg2, connectionProfileOrg3, certificateOrg2, certificateOrg3, privateKeyOrg2, privateKeyOrg3

}

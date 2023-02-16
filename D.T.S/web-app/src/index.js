const config = require('./config')
const isMaxmemoryPolicyNoeviction = require('./redis')
const { initJobQueue, initJobQueueWorker } = require('./jobs')
const connect = require('./db/connection')
const Fabric = require('./fabric')
const app = require('./app')
const port = app.get('port')

let jobQueue


const main = async () => {
	await connect()
	if (!(await isMaxmemoryPolicyNoeviction())) {
		throw new Error(
			'Invalid redis configuration: redis instance must have the setting maxmemory-policy=noeviction'
		)
	}

	const org1wallet = await Fabric.createWallet('org1')

	const identity = {
		credentials: {
			certificate: config.userCer,
			privateKey:config.userPrivateKey,
		},
		mspId: 'Org1MSP',
		type: 'X.509',
	}

	await org1wallet.put('user1', identity)

	app.locals[config.mspIdOrg1] = {
		ccp: config.connectionProfileOrg1,
		wallet: org1wallet
	}

	const org2wallet = await Fabric.createWallet('org2')

	app.locals[config.mspIdOrg2] = {
		ccp: config.connectionProfileOrg2,
		wallet: org2wallet
	}

	const org3wallet = await Fabric.createWallet('org3')

	app.locals[config.mspIdOrg3] = {
		ccp: config.connectionProfileOrg3,
		wallet: org3wallet
	}

	jobQueue = initJobQueue()
	initJobQueueWorker(app)
	app.locals.jobq = jobQueue

}

main()

app.listen(port, () => {
	// eslint-disable-next-line no-console
	console.log(`Server is listening at http://localhost:${port}`)
})

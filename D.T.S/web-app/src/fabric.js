const {
	DefaultEventHandlerStrategies,
	DefaultQueryHandlerStrategies,
	Gateway,
	Wallets,
} = require('fabric-network')
const FabricCAServices = require('fabric-ca-client')
const protos = require('fabric-protos')
const path = require('path')
const { AuthenticationError, NetworkConnectionError } = require('./Utills/fabricErrors.js/errors')
const config = require('./config')

class Fabric {

	constructor(orgMspId, data) {


		this.orgMsp=orgMspId
		this.org = data[orgMspId]
    
	}
	static createWallet = async (org) => {
		const walletPath = path.join(process.cwd(), `./${org}wallet`)
		const wallet = await Wallets.newFileSystemWallet(walletPath)
		// const wallet = await Wallets.newInMemoryWallet()
		return wallet
	}

	authenticateUser = async (userName, password) => {


		try {
			const caClient = this.getCaClient()
			const enrollment = await caClient.enroll({
				enrollmentID: userName,
				enrollmentSecret: password
			})
			const wallet = this.org.wallet
			await this.addToWallet(wallet, userName, enrollment.certificate, enrollment.key.toBytes())

			return true
		} catch (error) {
			if (error.message.includes('connect ECONNREFUSED')) {
				throw new NetworkConnectionError('A network connection error occurred.')
			} else if (error.message.includes('Authentication failure')) {
				throw new AuthenticationError('An authentication error occurred.')
			}
		}

	}

	getWallet = () => {
		return this.org.wallet
	}

	getConnectionProfile = () => {
		return this.org.ccp
	}

	getCaClient = () => {


		const ccp = this.getConnectionProfile()
		const caHostName = Object.keys(ccp.certificateAuthorities)[0]

		return this.buildCAClient(ccp, caHostName)
	}

	connect = async (userName) => {

		const ccp = this.getConnectionProfile()

		const wallet = this.getWallet()

		const gateway = await this.createGateway(
			ccp,
			userName,
			wallet
		)
		const network = await this.getNetwork(gateway)
		const contracts = await this.getContracts(network)
		this.org.contracts = contracts

	}


	disconnect = () => {
		this.org.gateway.disconnect()
	}

	addToWallet = async (wallet, username, certificate, privateKey) => {
		const identity = {
			credentials: {
				certificate,
				privateKey,
			},
			mspId: this.orgMsp,
			type: 'X.509',
		}

		await wallet.put(username, identity)
	}

	createGateway = async (
		connectionProfile,
		identity,
		wallet
	) => {

		const gateway = new Gateway()

		const options = {
			wallet,
			identity,
			discovery: { enabled: true, asLocalhost: config.asLocalhost },
			eventHandlerOptions: {
				commitTimeout: config.commitTimeout,
				endorseTimeout: config.endorseTimeout,
				strategy: DefaultEventHandlerStrategies.NETWORK_SCOPE_ALLFORTX,
			},
			queryHandlerOptions: {
				timeout: config.queryTimeout,
				strategy: DefaultQueryHandlerStrategies.MSPID_SCOPE_ROUND_ROBIN,
			},
		}

		await gateway.connect(connectionProfile, options)
		this.org.gateway = gateway

		return gateway
	}

	getNetwork = async (gateway) => {

		const network = await gateway.getNetwork(config.channelName)
		return network
	}

	getContracts = async (
		network
	) => {

		const assetContract = network.getContract(config.chaincodeName)
		const drugsContract= network.getContract('drugs-contract')
		const qsccContract = network.getContract('qscc')
		return { drugsContract,assetContract, qsccContract }
	}

	evatuateTransaction = async (

		transactionName,
		contract,
		...transactionArgs
	) => {

		const transaction = contract.createTransaction(transactionName)


		try {
			const payload = await transaction.evaluate(...transactionArgs)

			return payload
		} catch (err) {
			//TO DO
			return { message: err.toString() }
		}
	}

	isConnected = () => {
		// console.log(this.org)
		return this.org.contracts !== undefined
	}

	submitTransaction = async (transaction, job) => {
		const txnId = transaction.getTransactionId()
		try {


			const payload = await transaction.submit(...Object.values(job.data.transactionArgs))
			const validationCode = await this.getTransactionValidationCode(
				txnId
			)
      
			return { validationCode, transactionId: txnId, payload: payload.toString() }
		}
		catch (err) {
      
			return {
				transactionId: txnId,
				err: err.message.split('message=').pop()
			}

		}

	}


	getTransactionValidationCode = async (

		transactionId
	) => {
		const contract = this.org.contracts.qsccContract

		const data = await this.evatuateTransaction(

			'GetTransactionByID',
			contract,
			config.channelName,
			transactionId
		)

		const processedTransaction = protos.protos.ProcessedTransaction.decode(data)
		const validationCode =
      protos.protos.TxValidationCode[processedTransaction.validationCode]

		return validationCode
	}

	buildCAClient = (ccp, caHostName) => {
		// Create a new CA client for interacting with the CA.
		const caInfo = ccp.certificateAuthorities[caHostName] //lookup CA details from config
		const caTLSCACerts = caInfo.tlsCACerts.pem
		const caClient = new FabricCAServices(caInfo.url, { trustedRoots: caTLSCACerts, verify: false }, caInfo.caName)

		return caClient
	}

}


module.exports = Fabric

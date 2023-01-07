const {
  DefaultEventHandlerStrategies,
  DefaultQueryHandlerStrategies,
  Gateway,
  Wallets,
} = require('fabric-network')
const FabricCAServices = require('fabric-ca-client');

const protos = require('fabric-protos')
const config = require('./config')
const { handleError } = require('./errors')


class Fabric {

  constructor(app){
    this.app = app
  }

  authenticateUser = async (orgMsp, userName, password) => {
    

    try {
      const caClient = this.getCaClient(orgMsp)
      
      const enrollment = await caClient.enroll({
        enrollmentID: userName,
        enrollmentSecret: password
      });
     
      const wallet = this.getWallet(orgMsp)
      await this.addToWallet(wallet, userName, enrollment.certificate, enrollment.key.toBytes())
      return true

    } catch (err) {
      return { error: err.message }

    }
  }

  getWallet = (orgMsp) => {
    return this.app.locals[orgMsp].wallet
  }

  getConnectionProfile = (orgMsp) => {
    
    return this.app.locals[orgMsp].ccp
  }

  getCaClient = (orgMsp) => {
    
    const ccp = this.getConnectionProfile(orgMsp)
   
    const caHostName = Object.keys(ccp.certificateAuthorities)[0]
    
    return this.buildCAClient(ccp, caHostName)
  }

  connect = async (userName,orgMsp) => {
    try{
      const ccp = this.getConnectionProfile(orgMsp)
    
      const wallet = this.getWallet(orgMsp)
      
      const gateway = await this.createGateway(
        ccp,
        userName,
        wallet
      );
      const network = await this.getNetwork(gateway);
      const contracts = await this.getContracts(network);
      this.app.locals[orgMsp].contracts = contracts

    }catch(err){
      console.log(err)
    }
    
   

  }


  createWallet = async () => {
    const wallet = await Wallets.newInMemoryWallet()
    return wallet
  }

  addToWallet = async (wallet, username, certificate, privateKey) => {
    const identity = {
      credentials: {
        certificate,
        privateKey,
      },
      mspId: config.mspIdOrg1,
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
        strategy: DefaultEventHandlerStrategies.MSPID_SCOPE_ANYFORTX,
      },
      queryHandlerOptions: {
        timeout: config.queryTimeout,
        strategy: DefaultQueryHandlerStrategies.MSPID_SCOPE_ROUND_ROBIN,
      },
    }

    await gateway.connect(connectionProfile, options)

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
    const qsccContract = network.getContract('qscc')
    return { assetContract, qsccContract }
  }

  evatuateTransaction = async (
    contract,
    transactionName,
    ...transactionArgs
  ) => {

    const transaction = contract.createTransaction(transactionName)

    const transactionId = transaction.getTransactionId()

    try {
      const payload = await transaction.evaluate(...transactionArgs)

      return payload
    } catch (err) {
      throw handleError(transactionId, err)
    }
  }

  submitTransaction = async (transaction, job) => {
    const txnId = transaction.getTransactionId();
    try {

      const contract = this.app.locals[job.data.mspId].contracts.qsccContract
      const payload = await transaction.submit(...Object.values(job.data.transactionArgs));
      const validationCode = await this.getTransactionValidationCode(
        contract,
        txnId
      );

      return { validationCode, transactionId: txnId, payload: payload.toString() }
    }
    catch (err) {
      return {
        transactionId: txnId,
        err: err.message
      }

    }

  }


  getTransactionValidationCode = async (
    qsccContract,
    transactionId
  ) => {
    const data = await this.evatuateTransaction(
      qsccContract,
      'GetTransactionByID',
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
    const caInfo = ccp.certificateAuthorities[caHostName]; //lookup CA details from config
    const caTLSCACerts = caInfo.tlsCACerts.pem;
    const caClient = new FabricCAServices(caInfo.url, { trustedRoots: caTLSCACerts, verify: false }, caInfo.caName);
    
    return caClient;
  };

}






module.exports = Fabric

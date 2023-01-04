/*
 * SPDX-License-Identifier: Apache-2.0
 */

const {
  DefaultEventHandlerStrategies,
  DefaultQueryHandlerStrategies,
  Gateway,
  Wallets,
} = require('fabric-network')
const protos = require('fabric-protos')
const config = require('./config')
const { handleError } = require('./errors')

const createWallet = async () => {
  const wallet = await Wallets.newInMemoryWallet()
  return wallet
}

const addToWallet = async (wallet, username, certificate, privateKey) => {
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

const createGateway = async (
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

const getNetwork = async (gateway) => {

  const network = await gateway.getNetwork(config.channelName)
  return network
}

const getContracts = async (
  network
) => {

  const assetContract = network.getContract(config.chaincodeName)
  const qsccContract = network.getContract('qscc')
  return { assetContract, qsccContract }
}

const evatuateTransaction = async (
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

const submitTransaction = async (app, transaction, job) => {
  const txnId = transaction.getTransactionId();
  try {
    
    const contract = app.locals[job.data.mspId].contracts.qsccContract
    const payload = await transaction.submit(...Object.values(job.data.transactionArgs));
    const validationCode = await getTransactionValidationCode(
      contract,
      txnId
    );

    return { validationCode, transactionId: txnId, payload: payload.toString() }
  }
  catch (err) {
    return {
      transactionId:txnId,
      err : err.message
    }
   
    // if (err.name === 'Contract Error') {
    //   let message
    //   switch (err.status) {
    //     case 10: message = 'Batch already exists'
    //       break
    //     case 20: message = 'Batch does not exist'

    //   }
    //   return {
    //     name : err.name,
    //     err : message
    //   }
    // }

    
  }

}


const getTransactionValidationCode = async (
  qsccContract,
  transactionId
) => {
  const data = await evatuateTransaction(
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


module.exports = {
  getTransactionValidationCode,
  submitTransaction,
  evatuateTransaction,
  getContracts,
  getNetwork,
  createGateway,
  createWallet,
  addToWallet
}

const fabric_network_1 = require('fabric-network')
const path = require('path')
const fs = require('fs')

async function create () {
  try {
    // Create a new file system based wallet for managing identities.
    const walletPath = path.join(process.cwd(), 'Org1Wallet')
    const wallet = await fabric_network_1.Wallets.newFileSystemWallet(walletPath)
    console.log(`Wallet path: ${walletPath}`)
    // Create a new gateway for connecting to our peer node.
    const gateway = new fabric_network_1.Gateway()
    const connectionProfilePath = path.resolve(__dirname, 'connection.json')
    const connectionProfile = JSON.parse(fs.readFileSync(connectionProfilePath, 'utf8')) // eslint-disable-line @typescript-eslint/no-unsafe-assignment
    const connectionOptions = { wallet, identity: 'Org1 Admin', discovery: { enabled: true, asLocalhost: true } }
    await gateway.connect(connectionProfile, connectionOptions)
    // Get the network (channel) our contract is deployed to.
    const network = await gateway.getNetwork('mychannel')
    // Get the contract from the network.
    const contract = network.getContract('demo-contract')
    // Submit the specified transaction.
    //     await contract.submitTransaction('createMyAsset', 'id', 'asset');
    //    // console.log('Transaction has been submitted',response);
    // Disconnect from the gateway.
    const listener = async (event) => {
      console.log('listen for events ..')
      let _a
      if (event.eventName === 'myEvent') {
        console.log('chaincodeId: ', event.chaincodeId, ' eventName: ', event.eventName, ' payload: ', (_a = event.payload) === null || _a === void 0 ? void 0 : _a.toString())
      }
    }
    await contract.addContractListener(listener)
    /// gateway.disconnect();
    // res.json({msg:test})
  } catch (error) {
    console.error('Failed to submit transaction')
    next(error)
  }
}

module.exports = create

// ضايل تهندل قصة الايفينتس لما توصل كيف تنعمل
// add => pending => commited

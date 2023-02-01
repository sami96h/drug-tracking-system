const fabric_network_1 = require('fabric-network')
const path = require('path')
const fs = require('fs')
const RED = '\x1b[31m\n';
const GREEN = '\x1b[32m\n';
const BLUE = '\x1b[34m';
const RESET = '\x1b[0m';
async function main() {
  try {
    // Create a new file system based wallet for managing identities.
    const walletPath = path.join(process.cwd(), '..', 'org1wallet')
    const wallet = await fabric_network_1.Wallets.newFileSystemWallet(walletPath)
    // Create a new gateway for connecting to our peer node.
    const gateway = new fabric_network_1.Gateway()
    const connectionProfilePath = path.resolve(__dirname, '../network/organizations/peerOrganizations/org1.example.com/connection-org1.json')
    const connectionProfile = JSON.parse(fs.readFileSync(connectionProfilePath, 'utf8')) // eslint-disable-line @typescript-eslint/no-unsafe-assignment
    const connectionOptions = {
      wallet, identity: 'Admin', discovery: { enabled: true, asLocalhost: true }, eventHandlerOptions: {
        commitTimeout: 300,
        endorseTimeout: 30,
        strategy: fabric_network_1.DefaultEventHandlerStrategies.NETWORK_SCOPE_ALLFORTX,
      },
      queryHandlerOptions: {
        timeout: 3,
        strategy: fabric_network_1.DefaultQueryHandlerStrategies.MSPID_SCOPE_ROUND_ROBIN,
      }
    }
    await gateway.connect(connectionProfile, connectionOptions)
    // Get the network (channel) our contract is deployed to.
    const network = await gateway.getNetwork('mychannel')
    // Get the contract from the network.
    const contract = network.getContract('demo-contract')
    // Listen for myEvent publications
    await network.addBlockListener(
      async (event) => {
        if (event.blockData !== undefined) {
          for (const i in event.blockData.data.data) {
            if (event.blockData.data.data[i].payload.data.actions !== undefined) {
              // actions[actionItem].payload.action.proposal_response_payload.extension.results.ns_rwset
              const inputArgs = event.blockData.data.data[i].payload.data.actions[0].payload.chaincode_proposal_payload.input.chaincode_spec.input.args

              // Print block details
              console.log('----------')
              console.log(event.blockData.data.data[i].payload.data.actions[0].payload.action.proposal_response_payload.extension.response.payload.toString())
              console.log('Block:', parseInt(event.blockData.header.number), 'transaction', i)
              // Show ID and timestamp of the transaction
              const { tx_id } = event.blockData.data.data[i].payload.header.channel_header
              const txTime = new Date(event.blockData.data.data[i].payload.header.channel_header.timestamp).toUTCString()
              // Show ID, date and time of transaction
              console.log('Transaction ID:', tx_id)
              console.log('Timestamp:', txTime)
              // Show transaction inputs (formatted, as may contain binary data)
              let inputData = 'Inputs: '
              for (let j = 0; j < inputArgs.length; j++) {
                const inputArgPrintable = inputArgs[j].toString().replace(/[^\x20-\x7E]+/g, '')
                inputData = inputData.concat(inputArgPrintable, ' ')
              }

              console.log(inputData)
              // Show the proposed writes to the world state
              let keyData = 'Keys updated: '
              for (const l in event.blockData.data.data[i].payload.data.actions[0].payload.action.proposal_response_payload.extension.results.ns_rwset[1].rwset.writes) {
                // add a ' ' space between multiple keys in 'concat'
                keyData = keyData.concat(event.blockData.data.data[i].payload.data.actions[0].payload.action.proposal_response_payload.extension.results.ns_rwset[1].rwset.writes[l].key, ' ')
              }
              console.log(keyData)
              // Show which organizations endorsed
              let endorsers = 'Endorsers: '
              for (const k in event.blockData.data.data[i].payload.data.actions[0].payload.action.endorsements) {
                endorsers = endorsers.concat(event.blockData.data.data[i].payload.data.actions[0].payload.action.endorsements[k].endorser.mspid, ' ')
              }
              console.log(endorsers)
              // Was the transaction valid or not?
              // (Invalid transactions are still logged on the blockchain but don't affect the world state)
              if ((event.blockData.metadata.metadata[2])[i] !== 0) {
                console.log('INVALID TRANSACTION')
              }
            }
          }
        }
      }
    )
    // const listener = async (event) => {
    //   // The payload of the chaincode event is the value place there by the
    //   // chaincode. Notice it is a byte data and the application will have
    //   // to know how to deserialize.
    //   // In this case we know that the chaincode will always place the asset
    //   // being worked with as the payload for all events produced.
    //   const asset = JSON.parse(event.payload.toString());
    //   console.log(`${GREEN}<-- Contract Event Received: ${event.eventName} - ${JSON.stringify(asset)}${RESET}`);
    //   // show the information available with the event
    //   console.log(`*** Event: ${event.eventName}:${asset.ID}`);
    //   // notice how we have access to the transaction information that produced this chaincode event
    //   const eventTransaction = event.getTransactionEvent();
    //   console.log(`*** transaction: ${eventTransaction.transactionId} status:${eventTransaction.status}`);
    //   showTransactionData(eventTransaction.transactionData);
    //   // notice how we have access to the full block that contains this transaction
    //   const eventBlock = eventTransaction.getBlockEvent();
    //   console.log(`*** block: ${eventBlock.blockNumber.toString()}`);
    // };
    // function showTransactionData(transactionData) {
    //   const creator = transactionData.actions[0].header.creator;
    //   console.log(`    - submitted by: ${creator.mspid}-${creator.id_bytes.toString()}`);
    //   for (const endorsement of transactionData.actions[0].payload.action.endorsements) {
    //     console.log(`    - endorsed by: ${endorsement.endorser.mspid}-${endorsement.endorser.id_bytes.toString()}`);
    //   }
    //   const chaincode = transactionData.actions[0].payload.chaincode_proposal_payload.input.chaincode_spec;
    //   console.log(`    - chaincode:${chaincode.chaincode_id.name}`);
    //   console.log(`    - function:${chaincode.input.args[0].toString()}`);
    //   for (let x = 1; x < chaincode.input.args.length; x++) {
    //     console.log(`    - arg:${chaincode.input.args[x].toString()}`);
    //   }
    // }

    // await contract.addContractListener(listener)
    console.log('Listening for myEvent events...')

  } catch (error) {
    console.error('Error:', error)
    process.exit(1)
  }
}

void main()

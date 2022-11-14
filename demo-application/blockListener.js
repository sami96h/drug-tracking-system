const fabric_network_1 = require('fabric-network')
const path = require('path')
const fs = require('fs')

class BlockMap {
  constructor () {
    this.list = []
  }

  get (key) {
    key = parseInt(key, 10).toString()
    return this.list[`block${key}`]
  }

  set (key, value) {
    this.list[`block${key}`] = value
  }

  remove (key) {
    key = parseInt(key, 10).toString()
    delete this.list[`block${key}`]
  }
}

const ProcessingMap = new BlockMap()

async function main () {
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
    // Listen for myEvent publications
    const listener = await network.addBlockListener(
      async (event) => {
        if (event.blockData !== undefined) {
          for (const i in event.blockData.data.data) {
            if (event.blockData.data.data[i].payload.data.actions !== undefined) {
              const inputArgs = event.blockData.data.data[i].payload.data.actions[0].payload.chaincode_proposal_payload.input.chaincode_spec.input.args
              // Print block details
              console.log('----------')
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
  } catch (error) {
    console.error(`Failed to evaluate transaction: ${error}`)
    process.exit(1)
  }
}

async function processPendingBlocks (ProcessingMap) {
  setTimeout(async () => {
    // get the next block number from nextblock.txt
    let nextBlockNumber = fs.readFileSync(configPath, 'utf8')
    let processBlock

    do {
      // get the next block to process from the ProcessingMap
      processBlock = ProcessingMap.get(nextBlockNumber)
      if (processBlock == undefined) {
        break
      }

      try {
        await processBlockEvent(channelid, processBlock, nano)
      } catch (error) {
        console.error(`Failed to process block: ${error}`)
      }

      // if successful, remove the block from the ProcessingMap
      ProcessingMap.remove(nextBlockNumber)

      // increment the next block number to the next block
      fs.writeFileSync(configPath, parseInt(nextBlockNumber, 10) + 1)

      // retrive the next block number to process
      nextBlockNumber = fs.readFileSync(configPath, 'utf8')
    } while (true)

    processPendingBlocks(ProcessingMap)
  }, 250)
}

async function processBlockEvent (channelname, block, nano) {
  return new Promise(async (resolve, reject) => {
    // reject the block if the block number is not defined
    if (block.header.number == undefined) {
      reject(new Error('Undefined block number'))
    }

    const blockNumber = block.header.number

    console.log('------------------------------------------------')
    console.log(`Block Number: ${blockNumber}`)

    // reject if the data is not set
    if (block.data.data == undefined) {
      reject(new Error('Data block is not defined'))
    }

    const dataArray = block.data.data

    // transaction filter for each transaction in dataArray
    const txSuccess = block.metadata.metadata[2]

    for (const dataItem in dataArray) {
      // reject if a timestamp is not set
      if (dataArray[dataItem].payload.header.channel_header.timestamp == undefined) {
        reject(new Error('Transaction timestamp is not defined'))
      }

      // tx may be rejected at commit stage by peers
      // only valid transactions (code=0) update the word state and off-chain db
      // filter through valid tx, refer below for list of error codes
      // https://github.com/hyperledger/fabric-sdk-node/blob/release-1.4/fabric-client/lib/protos/peer/transaction.proto
      if (txSuccess[dataItem] !== 0) {
        continue
      }

      const timestamp = dataArray[dataItem].payload.header.channel_header.timestamp

      // continue to next tx if no actions are set
      if (dataArray[dataItem].payload.data.actions == undefined) {
        continue
      }

      // actions are stored as an array. In Fabric 1.4.3 only one
      // action exists per tx so we may simply use actions[0]
      // in case Fabric adds support for multiple actions
      // a for loop is used for demonstration
      const actions = dataArray[dataItem].payload.data.actions

      // iterate through all actions
      for (const actionItem in actions) {
        // reject if a chaincode id is not defined
        if (actions[actionItem].payload.chaincode_proposal_payload.input.chaincode_spec.chaincode_id.name == undefined) {
          reject(new Error('Chaincode name is not defined'))
        }

        const chaincodeID = actions[actionItem].payload.chaincode_proposal_payload.input.chaincode_spec.chaincode_id.name

        // reject if there is no readwrite set
        if (actions[actionItem].payload.action.proposal_response_payload.extension.results.ns_rwset == undefined) {
          reject(new Error('No readwrite set is defined'))
        }

        const rwSet = actions[actionItem].payload.action.proposal_response_payload.extension.results.ns_rwset

        for (const record in rwSet) {
          // ignore lscc events
          if (rwSet[record].namespace != 'lscc') {
            // create object to store properties
            const writeObject = new Object()
            writeObject.blocknumber = blockNumber
            writeObject.chaincodeid = chaincodeID
            writeObject.timestamp = timestamp
            writeObject.values = rwSet[record].rwset.writes

            console.log(`Transaction Timestamp: ${writeObject.timestamp}`)
            console.log(`ChaincodeID: ${writeObject.chaincodeid}`)
            console.log(writeObject.values)

            const logfilePath = path.resolve(__dirname, 'nextblock.txt')

            // send the object to a log file
            fs.appendFileSync(channelname + '_' + chaincodeID + '.log', JSON.stringify(writeObject) + '\n')

            // if couchdb is configured, then write to couchdb
          }
        };
      };
    };

    // update the nextblock.txt file to retrieve the next block
    fs.writeFileSync(configPath, parseInt(blockNumber, 10) + 1)

    resolve(true)
  })
}

void main()
// # sourceMappingURL=blockListener.js.map

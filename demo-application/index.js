const app = require('./app')
const config = require('./config')
const isMaxmemoryPolicyNoeviction = require('./redis')
const {initJobQueue,initJobQueueWorker} = require('./jobs')
const connect = require('./db/connection')
const Fabric = require('./fabric')
const port = app.get('port')

let jobQueue;
let jobQueueWorker;

const main = async () => {
  await connect()
  if (!(await isMaxmemoryPolicyNoeviction())) {
    throw new Error(
      'Invalid redis configuration: redis instance must have the setting maxmemory-policy=noeviction'
    );
  }

  const fabric = new Fabric()
  const org1wallet = await fabric.createWallet();

  app.locals[config.mspIdOrg1] = {
    ccp:config.connectionProfileOrg1 ,
    wallet:org1wallet
  };
  
  jobQueue = initJobQueue()
  jobQueueWorker = initJobQueueWorker(app);
  app.locals.jobq = jobQueue;

}

main()

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Server is listening at http://localhost:${port}`)
})

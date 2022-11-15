const { Router } = require('express')
const assetsRouter = require('./assetsRouter')
const jobsRouter = require('./jobsRouter')

const router = Router();

router.use('/assets', assetsRouter);
router.use('/jobs', jobsRouter);

module.exports=router
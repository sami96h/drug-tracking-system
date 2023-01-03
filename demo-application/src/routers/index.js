const { Router } = require('express')
const assetsRouter = require('./assetsRouter')
const jobsRouter = require('./jobsRouter')
const txRouter = require('./transactionsRouter')
const authRouter = require('./authRouter')
const router = Router();

router.use('/auth',authRouter)
router.use('/assets', assetsRouter);
router.use('/jobs', jobsRouter);
router.use('/transactions',txRouter)
module.exports=router
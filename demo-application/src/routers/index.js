const { Router } = require('express')
const batchesRouter = require('./batchesRouter')
const txRouter = require('./transactionsRouter')
const authRouter = require('./authRouter')
const authUser= require('../middleWares/authUser')
const boxRouter= require('./boxRouter')
const router = Router();

router.use('/auth',authRouter)
router.use('/assets', authUser,batchesRouter);
router.use('/transactions',authUser,txRouter)
router.use('/boxes',authUser,boxRouter)

module.exports=router



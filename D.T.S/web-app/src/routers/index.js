const { Router } = require('express')
const batchesRouter = require('./batchesRouter')
const txRouter = require('./transactionsRouter')
const authRouter = require('./authRouter')
const boxRouter= require('./boxRouter')
const {authenticateToken} = require('../middleWares/tokenAuth')

const router = Router()

router.use('/auth',authRouter)

router.use('/assets',authenticateToken,batchesRouter)
router.use('/transactions',authenticateToken,txRouter)
router.use('/boxes',boxRouter)

module.exports=router



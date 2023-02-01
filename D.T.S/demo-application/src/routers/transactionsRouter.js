const { Router } =require ('express')
const getTransactionsByUser = require('../controllers/getTransactionsByUser')

const router = Router()

router.get('/',getTransactionsByUser)

module.exports=router
const { Router } =require('express')
const BoxesController = require('../controllers/BoxesController')
const validate = require('../middleWares/validator')
const boxSchema = require('../Utills/validation/schemas/boxSchema')
// const {authenticateToken} = require('../middleWares/tokenAuth')

const router = Router()

router
	.get('/:Id', validate(boxSchema.paramValidation), BoxesController.getBox)
	// .post('/', authenticateToken,validate(boxSchema.bodyValidation), BoxesController.updateBox)
// .get('/:Id/exists', validate(batchSchema.batchIdSchema), BatchController.checkBatchExistence)
module.exports= router
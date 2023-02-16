const { Router } =require ('express')
const BoxesController = require('../controllers/BoxesController')
const BatchController = require('../controllers/BatchController')
const validate = require('../middleWares/validator')
const batchSchema = require('../Utills/validation/schemas/batchSchema')

const router = Router()

router
	.get('/test',BatchController.test)
	.get('/', BatchController.getAllBatches)
	.get('/:Id', validate(batchSchema.batchIdSchema), BatchController.getBatch)
	.get('/:Id/history', BatchController.getBatchHistory)
	.get('/:Id/boxes', validate(batchSchema.batchIdSchema), BoxesController.getBoxesByBatch)
	.patch('/', BatchController.updateBatch)
	.post('/', validate(batchSchema.addBatch), BatchController.createBatch)
	.delete('/:Id', validate(batchSchema.batchIdSchema), BatchController.deleteBatch)
  
module.exports=router
const { Router } =require ('express')
const BoxesController = require('../controllers/BoxesController')
const BatchController = require('../controllers/BatchController')

const router = Router();


router.get('/:Id/history', BatchController.getBatchHistory);
router.get('/:Id/boxes', BoxesController.getBoxesByBatch);
router.get('/:Id',BatchController.getBatch)
router.patch('/',BatchController.updateBatch)
router.post('/', BatchController.addBatch);
router.get('/',BatchController.getAllBatches)
router.delete('/:Id',BatchController.deleteBatch)

module.exports=router
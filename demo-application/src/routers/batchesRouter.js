const { Router } =require ('express')
const addAsset =require('../controllers/addAsset')
const getAssetHistory= require('../controllers/getAssetHistory')
const getAsset = require('../controllers/getAsset')
const getAllBatches = require('../controllers/getAllBatches')
const getBoxesByBatch = require('../controllers/getBoxesByBatch')
const router = Router();


router.get('/:Id/history', getAssetHistory);
router.get('/:Id/boxes', getBoxesByBatch);
router.get('/:Id',getAsset)
router.post('/', addAsset);
router.get('/',getAllBatches)

module.exports=router
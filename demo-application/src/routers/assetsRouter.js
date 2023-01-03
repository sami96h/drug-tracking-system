const { Router } =require ('express')
const addAsset =require('../controllers/addAsset')
const getAssetHistory= require('../controllers/getAssetHistory')
const getAsset = require('../controllers/getAsset')
const router = Router();


router.get('/:Id/history', getAssetHistory);
router.get('/:Id',getAsset)
router.post('/', addAsset);


module.exports=router
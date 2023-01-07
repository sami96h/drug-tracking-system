const { Router } =require('express')
const BoxesController = require('../controllers/BoxesController')

const router = Router();

router.get('/:Id', BoxesController.getBox);
router.post('/',BoxesController.updateBox)
module.exports= router;
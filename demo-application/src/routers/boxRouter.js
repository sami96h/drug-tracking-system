const getBox =require('../controllers/getBox')
const { Router } =require('express')

const router = Router();

router.get('/:Id', getBox);

module.exports= router;
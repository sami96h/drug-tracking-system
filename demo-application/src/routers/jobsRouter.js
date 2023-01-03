const { Router } =require ('express');
const getJob =require('../controllers/getJob')

const router = Router();


router.get('/:jobId', getJob)

module.exports=router
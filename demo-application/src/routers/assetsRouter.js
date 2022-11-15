const { Router } =require ('express');
const addAsset =require('../controllers/addAsset')

const router = Router();

router.get('/:Id', (req,res)=>{
res.json({msg:'assets get router'})
});

router.post('/', addAsset);


module.exports=router
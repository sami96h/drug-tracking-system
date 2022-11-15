const { Router } =require ('express');
// import UserController from '../controllers/UserController';

const router = Router();

router.get('/:Id', (req,res)=>{
res.json({msg:'assets get router'})
});

router.post('/', (req,res)=>{
    res.json({msg:'assets post router'})
});


module.exports=router
// import UserController from '../controllers/UserController';
const { Router } =require ('express');

const router = Router();

router.get('/', (req, res) => {
    res.json({ msg: 'jobs get router' })
});

router.post('/', (req, res) => {
    res.json({ msg: 'jobs post router' })
});


module.exports=router
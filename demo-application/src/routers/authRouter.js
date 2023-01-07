const authUser= require('../middleWares/authUser')
const UserController = require('../controllers/UserController')
const { Router } =require('express')

const router = Router();

router.post('/login', UserController.login);
router.post('/register',authUser,UserController.registerUser)

module.exports= router;
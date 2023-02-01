const { Router } =require('express')
const UserController = require('../controllers/UserController')
const {authenticateToken} = require('../middleWares/tokenAuth')

const router = Router()

router
	.post('/login', UserController.login)
// .post('/register', authUser, UserController.registerUser)
	.post('/token',UserController.checkToken)
	.get('/logout',authenticateToken,UserController.logout)

module.exports= router
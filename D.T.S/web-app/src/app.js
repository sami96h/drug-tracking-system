const { join } = require('path')
const cookieParser = require('cookie-parser')
const compression = require('compression')
const express = require('express')
const cors =require('cors')
const passport =require('passport')
const {jwtStrategy} = require('./middleWares/tokenAuth')
const router =require ('./routers')

const app = express()
app.set('port', 5000)
app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(compression())
app.use(express.static(join(__dirname, '..', 'public')))


// passport.use(fabricAPIKeyStrategy);
passport.use(jwtStrategy)
//initialize passport js
app.use(passport.initialize())


app.use(
	cors({
		origin: 'http://localhost:3000',
		credentials: true // access-control-allow-credentials:true
	})
)


app.use('/api/v1/',router)


app.use((err, req, res, next) => {
	res.status(500).json({ msg: err })
})
module.exports = app

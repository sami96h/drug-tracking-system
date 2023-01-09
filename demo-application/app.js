// core modules
const { join } = require('path')
// third party modules
const cookieParser = require('cookie-parser')
const compression = require('compression')
const express = require('express')
const cors =require('cors')
const { authenticateApiKey, fabricAPIKeyStrategy } =require('./middleWares/apiKeyAuth')
const passport =require('passport')

  

// my modules

const router =require ('./routers');
const app = express()

app.set('port', 5000)

app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(compression())
app.use(express.static(join(__dirname, '..', 'public')))


passport.use(fabricAPIKeyStrategy);
//initialize passport js
app.use(passport.initialize());



app.use(
  cors({
    origin: 'http://localhost:3000',
    credentials: true // access-control-allow-credentials:true
  })
);

// app.get('/test',create)
// app.use(router)
app.use('/api/v1/',authenticateApiKey ,router);

app.use((req, res, next) => {
  res.status(404).json({ msg: 'mas' })
  next()
})
app.use((err, req, res, next) => {
  res.status(500).json({ msg: err })
})
module.exports = app

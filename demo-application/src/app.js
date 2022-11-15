// core modules
const { join } = require('path')
// third party modules
const cookieParser = require('cookie-parser')
const compression = require('compression')
const express = require('express')
// my modules
const { body, validationResult }=require ('express-validator');
const { Contract, Transaction } =require('fabric-network')
const router =require ('./routers');
const app = express()

app.set('port', process.env.PORT || 3001)

app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(compression())
app.use(express.static(join(__dirname, '..', 'public')))



app.use(router)

app.use((req, res, next) => {
  res.status(404).json({ msg: 'mas' })
  next()
})
app.use((err, req, res, next) => {
  res.status(500).json({ msg: err })
})
module.exports = app

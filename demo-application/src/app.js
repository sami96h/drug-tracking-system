// core modules
const { join } = require('path')
// third party modules
const cookieParser = require('cookie-parser')
const compression = require('compression')
const express = require('express')
// my modules
var QRCode = require('qrcode')

const app = express()

app.set('port', process.env.PORT || 3001)

app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(compression())
app.use(express.static(join(__dirname, '..', 'public')))

QRCode.toString('I am a pony!',{type:'terminal'}, function (err, url) {
  console.log(url)
})

app.use((req, res) => {
  const qr = new QRious({ value: 'https://github.com/neocotic/node-qrious' })

  res.end(Buffer.from(qr.toDataURL(), 'base64'))
})

app.use((req, res, next) => {
  res.status(404).json({ msg: 'mas' })
  next()
})
app.use((err, req, res, next) => {
  res.status(500).json({ msg: err })
})
module.exports = app

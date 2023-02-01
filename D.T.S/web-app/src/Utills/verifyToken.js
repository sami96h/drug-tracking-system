const jwt = require('jsonwebtoken')
const config = require('../config')

const verifyToken = (token) => {
	return new Promise((resolve, reject) => {
		jwt.verify(token, config.secretKey, (error, decoded) => {
			if (error) {
				reject(error)
			} else {


				resolve(decoded)
			}
		})
	})
}

module.exports = verifyToken
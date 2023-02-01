const jwt = require('jsonwebtoken')
const config = require('../config')


const generateToken = (...userData) => {
    
	return new Promise((resolve, reject) => {
		jwt.sign(
			{ username:userData[0],org:userData[1]},
			config.secretKey,
			{ expiresIn: '8h' },
			(error, token) => {
				if (error) {
					reject(error)
				} else {
					resolve(token)
				}
			}
		)
	})
}

module.exports = generateToken
const jwt = require('jsonwebtoken');
const config = require('../config')


const generateToken = (id) => {
    console.log(config.secretKey)
    return new Promise((resolve, reject) => {
        jwt.sign(
            { id },
            config.secretKey,
            { expiresIn: '8h' },
            (error, token) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(token);
                }
            }
        );
    });
}
module.exports = generateToken
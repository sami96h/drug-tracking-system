const verifyToken = require('../Utills/verifyToken')
const fabric = require('../fabric')

const authUser = async (req, res, next) => {

    try {
        const { token } = req.cookies;
        if (!token) {
            
            return res.status(401).json({ msg: 'Unauthorized' })
        }
        const verifiedToken = await verifyToken(token)
        const userId = verifiedToken.id
        const wallet = req.app.locals[req.user].wallet
        const identity = await wallet.get(userId)
        if (!identity) {
           return res.status(401).json({ msg: 'Unauthorized' })
        }
        req.userId=userId
        next()

    } catch (err) {
        next(err)
    }

}

module.exports = authUser
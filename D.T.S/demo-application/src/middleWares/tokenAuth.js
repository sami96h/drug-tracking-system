const {  Strategy } = require('passport-jwt')
const { StatusCodes, getReasonPhrase } = require('http-status-codes')
const passport = require('passport')
const config = require('../config')
const Fabric = require('../fabric')


const { UNAUTHORIZED } = StatusCodes

const jwtOptions = {
	jwtFromRequest: (req) => {
		let token = null
		if (req && req.cookies) {
			token = req.cookies.token
		}
		return token
	},
	secretOrKey: config.secretKey
}


const jwtStrategy = new Strategy(jwtOptions, function ({ username, org }, done) {

	if (username && org && (org === 'org1' || org === 'org2'||org === 'org3')) {
		let orgMspId
		if(org === 'org1'){
			orgMspId =config.mspIdOrg1
		}else if(org === 'org2'){
			orgMspId =config.mspIdOrg2
		}else{
			orgMspId =config.mspIdOrg3
		}
        
		done(null, { username, orgMspId })
	} else {
		done(null, false)
	}
})


const authenticateToken = (
	req,
	res,
	next
) => {
	passport.authenticate(
		'jwt',
		{ session: false },
		async (err, user, _info) => {
            
			if (err) return next(err)


			if (!user)
				return res.status(UNAUTHORIZED).json({
					status: getReasonPhrase(UNAUTHORIZED),
					reason: 'INVALID_TOKEN',
					timestamp: new Date().toISOString(),
				})

			const { username, orgMspId } = user

			const fabric = new Fabric(orgMspId, req.app.locals)
			const wallet = fabric.getWallet()

			const identity = await wallet.get(username)
			if (!identity) {
				return res.status(401).json({ status: 'Unauthorized' })
			}

			try {
				if (!fabric.isConnected()) {
                    
					await fabric.connect(username)
				}
			} catch (err) {
				return res.status(401).json({ status: 'Unauthorized' })
			}


			req.logIn(user, { session: false }, async (err) => {
				if (err) {
					return next(err)
				}
				return next()
			})
		}
	)(req, res, next)
}

module.exports = {
	jwtStrategy,
	authenticateToken
}



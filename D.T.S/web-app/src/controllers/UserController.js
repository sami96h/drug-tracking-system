const Fabric = require('../fabric')
const generateToken = require('../Utills/generateToken')
const verifyToken = require('../Utills/verifyToken')
const config = require('../config')

class UserController {

	static login = async (
		req,
		res,
		next
	) => {
        
		try {
            

			let { password, username, Org } = req.body
			let fabric
			if (Org === 'org2' || Org === 'org3' || Org==='org1'
			) {
				fabric = new Fabric(Org === 'org1' ? config.mspIdOrg1 :Org==='org2'? config.mspIdOrg2:config.mspIdOrg3, req.app.locals)

			} else {
				console.log('******************', password, username, Org)
				return res.status(401).json({ msg: 'Invalid Credintials' })
			}

			await fabric.authenticateUser(username, password)

			await fabric.connect(username)
			const token = await generateToken(username, Org)

			res
				.status(200)
				.cookie('token', token)
				.json({
					statusCode: 200,
					message: 'success',
					user: {
						username,
						org:Org
					}
				})

		} catch (error) {
			if (error.name === 'AuthenticationError') {

				return res.status(401).json({ msg: 'Invalid Credintials' })
			}
			console.log(error)
			next(error)
		}
	}

	// static registerUser = async (req, res, next) => {
	// 	const { userId } = req.body
	// 	try {

	// 		if (req.userName !== 'admin') {
	// 			return res.status(401).json({ msg: 'Unauth' })
	// 		}

	// 		const wallet = req.app.locals[req.user].wallet

	// 		// Must use an admin to register a new user
	// 		const adminIdentity = await wallet.get(req.userName)

	// 		// build a user object for authenticating with the CA
	// 		const provider = wallet.getProviderRegistry().getProvider(adminIdentity.type)
	// 		const adminUser = await provider.getUserContext(adminIdentity, req.userName)
	// 		const ccp = req.app.locals[req.user].ccp
	// 		const caHostName = Object.keys(ccp.certificateAuthorities)[0]
	// 		const caClient = fabric.buildCAClient(FabricCAServices, ccp, caHostName)
	// 		// Register the user, enroll the user, and import the new identity into the wallet.
	// 		// if affiliation is specified by client, the affiliation value must be configured in CA
	// 		const secret = await caClient.register({

	// 			enrollmentID: userId,
	// 			role: 'client'
	// 		}, adminUser)

	// 		res.status(200).json({ 'User secret': secret })
	// 	} catch (error) {
	// 		next(error)
	// 	}
	// }

	static checkToken = async (req, res, next) => {
       
		try {

			const { token } = req.cookies

			if (!token) {

				return res.status(401).json({ status: 'Unauthorized' })
			}
			const {username,org} = await verifyToken(token)
            
			const fabric = new Fabric(org==='org1'?config.mspIdOrg1:org==='org2'?config.mspIdOrg2:config.mspIdOrg3, req.app.locals)

			const wallet = fabric.getWallet()

			const identity = await wallet.get(username)

			if (!identity) {
				return res.status(401).json({ status: 'Unauthorized' })
			}

			if (!fabric.isConnected(req.user)) {
				await fabric.connect(username)
			}
			res.status(200).json({
				username,
				org
			})
		} catch (err) {
            
			next(err)
		}
	}
	static logout = async (req, res, next) => {
		const fabric = new Fabric(req.user.orgMspId, req.app.locals)

		fabric.disconnect()
		res.clearCookie('token').status(200).json({
			message: 'success'
		})
	}
}

module.exports = UserController
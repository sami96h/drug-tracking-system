const FabricCAServices = require('fabric-ca-client');
const Fabric = require('../fabric')
const generateToken = require('../Utills/generateToken')


class UserController {

    static login = async (
        req,
        res,
        next
    ) => {
        try {
            const fabric = new Fabric(req.app)

            const { password, username } = req.body;
            try {

                const auth = await fabric.authenticateUser(req.user, username, password)
                
                if (auth.error) {
                    return res.status(401).json({ msg: 'Not Auth' })

                }
                await fabric.connect(username,req.user)
               


                const token = await generateToken(username)

                res
                    .status(200)
                    .cookie('token', token)
                    .json({
                        statusCode: 200,
                        message: 'success',
                        user: {
                            username,

                        }
                    });
            }
            catch (err) {
                res.status(400).json({ msg: 'Invalid credentials' })
            }
        } catch (error) {

            next(error);
        }
    }

    static registerUser = async (req, res, next) => {
        const { userId } = req.body
        try {

            if (req.userName !== 'admin') {
                return res.status(401).json({ msg: 'Unauth' })
            }

            const wallet = req.app.locals[req.user].wallet

            // Must use an admin to register a new user
            const adminIdentity = await wallet.get(req.userName);

            // build a user object for authenticating with the CA
            const provider = wallet.getProviderRegistry().getProvider(adminIdentity.type);
            const adminUser = await provider.getUserContext(adminIdentity, req.userName);
            const ccp = req.app.locals[req.user].ccp
            const caHostName = Object.keys(ccp.certificateAuthorities)[0]
            const caClient = fabric.buildCAClient(FabricCAServices, ccp, caHostName)
            // Register the user, enroll the user, and import the new identity into the wallet.
            // if affiliation is specified by client, the affiliation value must be configured in CA
            const secret = await caClient.register({

                enrollmentID: userId,
                role: 'client'
            }, adminUser);

            res.status(200).json({ 'User secret': secret })
        } catch (error) {
            next(error)
        }
    }
}

module.exports = UserController
const FabricCAServices = require('fabric-ca-client');
const { buildCAClient } = require('../register')
const fabric = require('../fabric')
const generateToken = require('../Utills/generateToken')

const login = async (
    req,
    res,
    next
) => {
    try {
        const { password, username } = req.body;
        const ccp = req.app.locals[req.user].ccp
        const caHostName = Object.keys(ccp.certificateAuthorities)[0]
        const caClient = buildCAClient(FabricCAServices, ccp, caHostName)
        try {
            const enrollment = await caClient.enroll({
                enrollmentID: username,
                enrollmentSecret: password
            });
            const wallet = req.app.locals[req.user].wallet
            await fabric.addToWallet(wallet, username, enrollment.certificate, enrollment.key.toBytes())
            const gateway = await fabric.createGateway(
                ccp,
                username,
                wallet
            );
            const network = await fabric.getNetwork(gateway);
            const contracts = await fabric.getContracts(network);
            req.app.locals[req.user].contracts = contracts
           
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
};

module.exports = login
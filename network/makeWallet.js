/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';


const { Wallets } = require('fabric-network');
const path = require('path');
const fs = require("fs");


const addToWallet = async (wallet, userName, certificate, key, mspId) => {
    const x509Identity = {
        credentials: {
            certificate: certificate,
            privateKey: key,
        },
        mspId: mspId ? `Org${mspId}MSP` : 'OrdererMSP',
        type: 'X.509',
    };
    await wallet.put(userName, x509Identity);
}

async function main(org) {
    if (org === 'orderer') {
        const walletPath = path.join(process.cwd(), `../${org}wallet`);
        const wallet = await Wallets.newFileSystemWallet(walletPath);
        const ordererAdminPath = 'organizations/ordererOrganizations/example.com/users/Admin@example.com/msp'
        const ordererCer = fs.readFileSync(path.join(ordererAdminPath, 'signcerts', 'cert.pem'), 'utf8');
        let ordererKey = (fs.readdirSync(path.join(ordererAdminPath, 'keystore')))[0];
        ordererKey = path.join(ordererAdminPath, 'keystore', ordererKey)
        const Okey = fs.readFileSync(ordererKey, 'utf8');
        addToWallet(wallet, 'Orderer Admin', ordererCer, Okey, 0)
        return

    }
    const walletPath = path.join(process.cwd(), `../${org}wallet`);
    const wallet = await Wallets.newFileSystemWallet(walletPath);
    //ca admin
    const mainPath = `organizations/peerOrganizations/${org}.example.com`
    const cerPath = `${mainPath}/msp/signcerts/cert.pem`
    const keyPath = `${mainPath}/msp/keystore`

    const keyName = fs.readdirSync(keyPath);
    const CaAdminCer = fs.readFileSync(cerPath, 'utf8');
    const caAdminkey = fs.readFileSync(path.join(keyPath, keyName[0]), 'utf8');
    addToWallet(wallet, 'CA Admin', CaAdminCer, caAdminkey, org[org.length - 1])



    // org admin 

    const usersPath = `${mainPath}/users`
    const temp = fs.readdirSync(usersPath)

    for (let user of temp) {


        const userName = user.slice(0, user.indexOf('@'))
        console.log(userName)
        user = path.join(usersPath, user, 'msp')
        let key = fs.readdirSync(path.join(user, 'keystore'))
        const CERPATH = path.join(user, 'signcerts', 'cert.pem')
        const certificate = fs.readFileSync(CERPATH, 'utf8');
        key = path.join(user, 'keystore', key[0])
        key = fs.readFileSync(key, 'utf8');




        addToWallet(wallet, userName, certificate, key, org[org.length - 1])



    }

    const peersPath = `${mainPath}/peers`
    const peersNames = fs.readdirSync(peersPath)
    for (let peer of peersNames) {
        const peerName = peer.slice(0, peer.indexOf('.example'))
        console.log(peerName)
        peer = path.join(peersPath, peer, 'msp')
        let key = fs.readdirSync(path.join(peer, 'keystore'))
        const CERPATH = path.join(peer, 'signcerts', 'cert.pem')
        const certificate = fs.readFileSync(CERPATH, 'utf8');

        key = path.join(peer, 'keystore', key[0])
        key = fs.readFileSync(key, 'utf8');




        addToWallet(wallet, peerName, certificate, key)

    }


    // 'organizations/peerOrganizations/org1.example.com/msp/signcerts/localhost-7054-ca-org1.pem'
    // 'organizations/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp/localhost-7054-ca-org1.pem'
    // const files2 = fs.readdirSync(`${mainPath}/users/Admin@${org}.example.com/msp/keystore`);
    // const adminKey= files2[0];

    // // org user 
    // const files3 = fs.readdirSync(`${mainPath}/user/User1@${org}.example.com/msp/keystore`);
    // const userKey= path.join(files2[0],);


    // console.log(filenames)
    //     try {

    //         const walletPath = path.join(process.cwd(), '../identity/Org1/CA_Admin');
    //         var fs = require('fs');

    // // Use fs.readFile() method to read the file
    // const certificate= fs.readFileSync('organizations/peerOrganizations/org1.example.com/msp/signcerts/localhost-7054-ca-org1.pem', 'utf8');
    // const key = fs.readFileSync('organizations/peerOrganizations/org1.example.com/msp/keystore/b8e2af6f0ef181a2fe5fd628686bf0f2f1397eb5f58b89181a40ee1ae54408a7_sk', 'utf8');


    //         const wallet = await Wallets.newFileSystemWallet(walletPath);


    //         const x509Identity = {
    //             credentials: {
    //                 certificate: certificate,
    //                 privateKey: key,
    //             },
    //             mspId: 'Org1MSP',
    //             type: 'X.509',
    //         };
    //         await wallet.put('CA Admin', x509Identity);
    //         console.log('Successfully enrolled client user "balaji" and imported it into the wallet');

    //     } catch (error) {
    //         console.error("Failed to enroll ",error);
    //         process.exit(1);
    //     }
}

main('org1');
main('org2');
main('orderer');

// main('organizations/peerOrganizations/org1.example.com/msp/signcerts/localhost-7054-ca-org1.pem','organizations/peerOrganizations/org1.example.com/msp/keystore/b8e2af6f0ef181a2fe5fd628686bf0f2f1397eb5f58b89181a40ee1ae54408a7_sk','Org1 CA Admin');
// main('organizations/peerOrganizations/org1.example.com/msp/signcerts/localhost-7054-ca-org1.pem','organizations/peerOrganizations/org1.example.com/msp/keystore/b8e2af6f0ef181a2fe5fd628686bf0f2f1397eb5f58b89181a40ee1ae54408a7_sk','Org1 CA Admin');
// main('organizations/peerOrganizations/org1.example.com/msp/signcerts/localhost-7054-ca-org1.pem','organizations/peerOrganizations/org1.example.com/msp/keystore/b8e2af6f0ef181a2fe5fd628686bf0f2f1397eb5f58b89181a40ee1ae54408a7_sk','Org1 CA Admin');
// main('organizations/peerOrganizations/org1.example.com/msp/signcerts/localhost-7054-ca-org1.pem','organizations/peerOrganizations/org1.example.com/msp/keystore/b8e2af6f0ef181a2fe5fd628686bf0f2f1397eb5f58b89181a40ee1ae54408a7_sk','Org1 CA Admin');
// main('organizations/peerOrganizations/org1.example.com/msp/signcerts/localhost-7054-ca-org1.pem','organizations/peerOrganizations/org1.example.com/msp/keystore/b8e2af6f0ef181a2fe5fd628686bf0f2f1397eb5f58b89181a40ee1ae54408a7_sk','Org1 CA Admin');
// main('organizations/peerOrganizations/org1.example.com/msp/signcerts/localhost-7054-ca-org1.pem','organizations/peerOrganizations/org1.example.com/msp/keystore/b8e2af6f0ef181a2fe5fd628686bf0f2f1397eb5f58b89181a40ee1ae54408a7_sk','Org1 CA Admin');

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
        peer = path.join(peersPath, peer, 'msp')
        let key = fs.readdirSync(path.join(peer, 'keystore'))
        const CERPATH = path.join(peer, 'signcerts', 'cert.pem')
        const certificate = fs.readFileSync(CERPATH, 'utf8');
        key = path.join(peer, 'keystore', key[0])
        key = fs.readFileSync(key, 'utf8');
        addToWallet(wallet, peerName, certificate, key)
    }
}

main('org1');
main('org2');
main('org3');
main('orderer');


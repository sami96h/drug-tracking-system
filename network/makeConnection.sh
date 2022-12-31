#!/bin/sh

 

PEM1=$(cat ./organizations/peerOrganizations/org1.example.com/tlsca/tlsca.org1.example.com-cert.pem | base64 |tr -d '\n')
PEM2=$(cat ./organizations/peerOrganizations/org2.example.com/tlsca/tlsca.org2.example.com-cert.pem | base64|tr -d '\n')
PEMCA1=$(cat ./organizations/peerOrganizations/org1.example.com/ca/ca.org1.example.com-cert.pem | base64|tr -d '\n')
PEMCA2=$(cat ./organizations/peerOrganizations/org2.example.com/ca/ca.org2.example.com-cert.pem | base64|tr -d '\n')


JSON='[
    {
        "name": "peer1.org1.example.com",
        "api_url": "grpcs://localhost:7056",
        "type": "fabric-peer",
        "msp_id": "Org1MSP",
        "pem": "%s",
        "wallet": "org1wallet",
        "identity": "Admin"
    },
    {
        "name": "peer0.org1.example.com",
        "api_url": "grpcs://localhost:7051",
        "type": "fabric-peer",
        "msp_id": "Org1MSP",
        "pem": "%s",
        "wallet": "org1wallet",
        "identity": "Admin"

    },
    {
        "name": "peer2.org1.example.com",
        "api_url": "grpcs://localhost:7057",
        "type": "fabric-peer",
        "msp_id": "Org1MSP",
        "pem": "%s",
        "wallet": "org1wallet",
        "identity": "Admin"

    },
    {
        "name": "ca.org1.example.com",
        "api_url": "https://localhost:7054",
        "type": "fabric-ca",
        "msp_id": "Org1MSP",
        "ca_name": "ca-org1",
        "enroll_id": "admin",
        "enroll_secret": "adminpw",
        "pem":"%s",
        "wallet": "org1wallet",
        "identity": "CA Admin"

    },
    {
        "name": "peer0.org2.example.com",
        "api_url": "grpcs://localhost:9051",
        "type": "fabric-peer",
        "msp_id": "Org2MSP",
        "pem": "%s",
        "wallet": "org2wallet",
        "identity": "Admin"

    },
    {
        "name": "ca.org2.example.com",
        "api_url": "https://localhost:8054",
        "type": "fabric-ca",
        "msp_id": "Org2MSP",
        "ca_name": "ca-org2",
        "enroll_id": "admin",
        "enroll_secret": "adminpw",
        "pem":"%s",
        "wallet": "org2wallet",
        "identity": "CA Admin"

    },
    {
        "name": "orderer.example.com",
        "api_url": "grpc://localhost:7050",
        "type": "fabric-orderer",
        "msp_id": "OrdererMSP",
        "wallet": "ordererwallet",
        "identity": "Orderer Admin"

    },
    {
        "name": "orderer1.example.com",
        "api_url": "grpc://localhost:7055",
        "type": "fabric-orderer",
        "msp_id": "OrdererMSP",
        "wallet": "ordererwallet",
        "identity": "Orderer Admin"

    },
    {
        "name": "orderer2.example.com",
        "api_url": "grpc://localhost:4050",
        "type": "fabric-orderer",
        "msp_id": "OrdererMSP",
        "wallet": "ordererwallet",
        "identity": "Orderer Admin"

    }
]\n'
printf "$JSON" "$PEM1" "$PEM1" "$PEM1" "$PEMCA1" "$PEM2" "$PEMCA1" > networkProfile.json


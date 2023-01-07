#!/bin/bash

source scripts/utils.sh

CHANNEL_NAME=${1}
CC_NAME=${2}
CC_SRC_PATH=${3}
CC_SRC_LANGUAGE=${4}
CC_VERSION=${5}
CC_SEQUENCE=${6}
DELAY=${7}
MAX_RETRY=${8}
VERBOSE=${9}

println "executing with the following"
println "- CHANNEL_NAME: ${C_GREEN}${CHANNEL_NAME}${C_RESET}"
println "- CC_NAME: ${C_GREEN}${CC_NAME}${C_RESET}"
println "- CC_SRC_PATH: ${C_GREEN}${CC_SRC_PATH}${C_RESET}"
println "- CC_SRC_LANGUAGE: ${C_GREEN}${CC_SRC_LANGUAGE}${C_RESET}"
println "- CC_VERSION: ${C_GREEN}${CC_VERSION}${C_RESET}"
println "- CC_SEQUENCE: ${C_GREEN}${CC_SEQUENCE}${C_RESET}"
println "- DELAY: ${C_GREEN}${DELAY}${C_RESET}"
println "- MAX_RETRY: ${C_GREEN}${MAX_RETRY}${C_RESET}"
println "- VERBOSE: ${C_GREEN}${VERBOSE}${C_RESET}"

FABRIC_CFG_PATH=$PWD/../config/

# import utils
. scripts/envVar.sh
. scripts/ccutils.sh

packageChaincode() {
  set -x
  peer lifecycle chaincode package demo-contract.tar.gz --path ../demo-contract --lang node --label demo-contract_1.0 >&log.txt
  res=$?
  PACKAGE_ID=$(peer lifecycle chaincode calculatepackageid demo-contract.tar.gz)
  { set +x; } 2>/dev/null
  cat log.txt
  verifyResult $res "Chaincode packaging has failed"
  successln "Chaincode is packaged"
}

## package the chaincode
packageChaincode

## Install chaincode on peer0.org1 and peer0.org2
infoln "Installing chaincode on org1 peers"
export_peer_context 0 1
installChaincode 0 1
export_peer_context 1 1
installChaincode 1 1
export_peer_context 2 1
installChaincode 2 1
infoln "Install chaincode on org2 peers"
export_peer_context 0 2
installChaincode 0 2

## query whether the chaincode is installed
export_peer_context 0 1
queryInstalled 0 1
export_peer_context 1 1
queryInstalled 1 1
export_peer_context 2 1
queryInstalled 2 1

export_peer_context 0 2
queryInstalled 0 2

## approve the definition for org1

approveForMyOrg 1


## check whether the chaincode definition is ready to be committed

## expect org1 to have approved and org2 not to
checkCommitReadiness 1 "\"Org1MSP\": true" "\"Org2MSP\": false"
checkCommitReadiness 2 "\"Org1MSP\": true" "\"Org2MSP\": false"

## now approve also for org2

approveForMyOrg 2

## check whether the chaincode definition is ready to be committed
## expect them both to have approved
checkCommitReadiness 1 "\"Org1MSP\": true" "\"Org2MSP\": true"
checkCommitReadiness 2 "\"Org1MSP\": true" "\"Org2MSP\": true"

## now that we know for sure both orgs have approved, commit the definition
commitChaincodeDefinition 1 2

## query on both orgs to see that the definition committed successfully
export_peer_context 0 1
queryCommitted 0 1
export_peer_context 1 1
queryCommitted 1 1
export_peer_context 2 1
queryCommitted 2 1
export_peer_context 0 2
queryCommitted 0 2

exit 0
#!/bin/bash

# imports
. scripts/envVar.sh
. scripts/utils.sh

CHANNEL_NAME="$1"
DELAY="$2"
MAX_RETRY="$3"
VERBOSE="$4"
: ${CHANNEL_NAME:="mychannel"}
: ${DELAY:="3"}
: ${MAX_RETRY:="5"}
: ${VERBOSE:="false"}

: ${CONTAINER_CLI:="docker"}
: ${CONTAINER_CLI_COMPOSE:="${CONTAINER_CLI}-compose"}
infoln "Using ${CONTAINER_CLI} and ${CONTAINER_CLI_COMPOSE}"

if [ ! -d "channel-artifacts" ]; then
  mkdir channel-artifacts
fi

createChannelGenesisBlock() {
  which configtxgen
  if [ "$?" -ne 0 ]; then
    fatalln "configtxgen tool not found."
  fi
  set -x
  configtxgen -profile TwoOrgsApplicationGenesis -outputBlock ./channel-artifacts/mychannel.block -channelID mychannel > lool.txt
  
  res=$?
  { set +x; } 2>/dev/null
  verifyResult $res "Failed to generate channel configuration transaction..."
}

joinOrderer() {
  orderer_arg="-o localhost:$(eval echo \$ORDERER${1}_PORT)"
  local rc=1
  local COUNTER=1
  while [ $rc -ne 0 -a $COUNTER -lt $MAX_RETRY ] ; do
      
    sleep $DELAY
    set -x
    osnadmin channel join \
      --channelID mychannel \
      --config-block ./channel-artifacts/mychannel.block \
      $orderer_arg \
      --ca-file "$ORDERER_CA" \
      --client-cert ${PWD}/organizations/ordererOrganizations/example.com/orderers/orderer${1}.example.com/tls/server.crt \
      --client-key ${PWD}/organizations/ordererOrganizations/example.com/orderers/orderer${1}.example.com/tls/server.key >&log1.txt

    res=$?
    { set +x; } 2>/dev/null
    let rc=$res
    COUNTER=$(expr $COUNTER + 1)
  done
  cat log1.txt
  verifyResult $res "Channel creation failed"
}

joinOrderers() {
  setGlobals 1

  joinOrderer 0
  joinOrderer 1 
  joinOrderer 2
}

joinPeer() {
  local rc=1
  local COUNTER=1
  ## Sometimes Join takes time, hence retry
  while [ $rc -ne 0 -a $COUNTER -lt $MAX_RETRY ] ; do
    sleep $DELAY
    set -x
    peer channel join -b ./channel-artifacts/mychannel.block >&log.txt
    res=$?
    { set +x; } 2>/dev/null
    let rc=$res
    COUNTER=$(expr $COUNTER + 1)
  done
  cat log.txt
  verifyResult $res "After $MAX_RETRY attempts, peer${1}.org${2} has failed to join channel 'mychannel' "
}

joinChannelPeers() {
  FABRIC_CFG_PATH=$PWD/../config/
  infoln "Joining org1 peers to channel"
  export_peer_context 0 1
  joinPeer 0 1
  export_peer_context 1 1
  joinPeer 1 1
  export_peer_context 2 1
  joinPeer 2 1
  infoln "Joining org2 peers to channel"
  export_peer_context 0 2
  joinPeer 0 2
  infoln "Joining org3 peers to channel"
  export_peer_context 0 3
  joinPeer 0 3
}

setAnchorPeer() {
  infoln "Set andchor peer for org${1}"
  ORG=$1
  docker exec cli ./scripts/setAnchorPeer.sh $ORG mychannel 
}

FABRIC_CFG_PATH=${PWD}/configtx

## Create channel genesis block
infoln "Generating channel genesis block 'mychannel.block'"
createChannelGenesisBlock

## Join all orderers to the channel
infoln "Joining orderers to the channel 'mychannel'"
joinOrderers

## Join all peers to the channel
infoln "Joining peers to the channel 'mychannel'"
joinChannelPeers

## Set the anchor peers for each organization

setAnchorPeer 1
setAnchorPeer 2
setAnchorPeer 3

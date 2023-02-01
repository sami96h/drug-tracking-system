#!/bin/bash
#
# Copyright IBM Corp All Rights Reserved
#
# SPDX-License-Identifier: Apache-2.0
#

ROOTDIR=$(cd "$(dirname "$0")" && pwd)
export PATH=${PWD}/../../bin:$PATH
export FABRIC_CFG_PATH=${PWD}/configtx
export VERBOSE=false

# push to the required directory & set a trap to go back if needed
pushd ${ROOTDIR} >/dev/null
trap "popd > /dev/null" EXIT

. scripts/utils.sh

: ${CONTAINER_CLI:="docker"}
: ${CONTAINER_CLI_COMPOSE:="docker-compose"}
infoln "Using docker docker-compose"

# Obtain CONTAINER_IDS remove them
# This function is called when you bring a network down
function clearContainers() {
  infoln "Removing remaining containers"
  docker rm -f $(docker ps -aq --filter label=service=hyperledger-fabric) 2>/dev/null || true
  docker rm -f $(docker ps -aq --filter name='dev-peer*') 2>/dev/null || true
  docker rm -f $(docker ps -aq --filter name='redis') 2>/dev/null || true
}

# Delete any images that were generated as a part of this setup
# specifically the following images are often left behind:
# This function is called when you bring the network down
function removeUnwantedImages() {
  infoln "Removing generated chaincode docker images"
  docker image rm -f $(docker images -aq --filter reference='dev-peer*') 2>/dev/null || true
}

# Versions of fabric known not to work with the test network
NONWORKING_VERSIONS="^1\.0\. ^1\.1\. ^1\.2\. ^1\.3\. ^1\.4\."

# Do some basic sanity checking to make sure that the appropriate versions of fabric
# binaries/images are available. In the future, additional checking for the presence
# of go or other items could be added.
function checkPrereqs() {
  ## Check if your have cloned the peer binaries configuration files.
  peer version >/dev/null 2>&1

  if [[ $? -ne 0 || ! -d "../config" ]]; then
    pwd
    errorln "Peer binary configuration files not found.."
    errorln
    errorln "Follow the instructions in the Fabric docs to install the Fabric Binaries:"
    errorln "https://hyperledger-fabric.readthedocs.io/en/latest/install.html"
    exit 1
  fi
  # use the fabric tools container to see if the samples binaries match your
  # docker images
  LOCAL_VERSION=$(peer version | sed -ne 's/^ Version: //p')
  DOCKER_IMAGE_VERSION=$(docker run --rm hyperledger/fabric-tools:latest peer version | sed -ne 's/^ Version: //p')

  infoln "LOCAL_VERSION=$LOCAL_VERSION"
  infoln "DOCKER_IMAGE_VERSION=$DOCKER_IMAGE_VERSION"

  if [ "$LOCAL_VERSION" != "$DOCKER_IMAGE_VERSION" ]; then
    warnln "Local fabric binaries docker images are out of  sync. This may cause problems."
  fi

  for UNSUPPORTED_VERSION in $NONWORKING_VERSIONS; do
    infoln "$LOCAL_VERSION" | grep -q $UNSUPPORTED_VERSION
    if [ $? -eq 0 ]; then
      fatalln "Local Fabric binary version of $LOCAL_VERSION does not match the versions supported by the test network."
    fi

    infoln "$DOCKER_IMAGE_VERSION" | grep -q $UNSUPPORTED_VERSION
    if [ $? -eq 0 ]; then
      fatalln "Fabric Docker image version of $DOCKER_IMAGE_VERSION does not match the versions supported by the test network."
    fi
  done

  ## Check for fabric-ca

  fabric-ca-client version >/dev/null 2>&1
  if [[ $? -ne 0 ]]; then
    errorln "fabric-ca-client binary not found.."
    errorln
    errorln "Follow the instructions in the Fabric docs to install the Fabric Binaries:"
    errorln "https://hyperledger-fabric.readthedocs.io/en/latest/install.html"
    exit 1
  fi
  CA_LOCAL_VERSION=$(fabric-ca-client version | sed -ne 's/ Version: //p')
  CA_DOCKER_IMAGE_VERSION=$(docker run --rm hyperledger/fabric-ca:latest fabric-ca-client version | sed -ne 's/ Version: //p' | head -1)
  infoln "CA_LOCAL_VERSION=$CA_LOCAL_VERSION"
  infoln "CA_DOCKER_IMAGE_VERSION=$CA_DOCKER_IMAGE_VERSION"

  if [ "$CA_LOCAL_VERSION" != "$CA_DOCKER_IMAGE_VERSION" ]; then
    warnln "Local fabric-ca binaries docker images are out of sync. This may cause problems."
  fi

}

function createOrgs() {
  if [ -d "organizations/peerOrganizations" ]; then
    rm -Rf organizations/peerOrganizations && rm -Rf organizations/ordererOrganizations
  fi

  # Create crypto material using Fabric CA

  infoln "Generating certificates using Fabric CA"
  docker-compose -f compose/compose-ca.yaml -f compose/docker/docker-compose-ca.yaml up -d 2>&1

  . organizations/fabric-ca/registerEnroll.sh

  while :; do
    if [ ! -f "organizations/fabric-ca/org1/tls-cert.pem" ]; then
      sleep 1
    else
      break
    fi
  done

  infoln "Creating Org1 Identities"

  createOrg1

  infoln "Creating Org2 Identities"

  createOrg2

  infoln "Creating Org3 Identities"

  createOrg3


  infoln "Creating Orderer Org Identities"

  createOrderer


  ## --- for IBM extention use -- ##

  infoln "Generating connection profile"
  # ./organizations/ccp-generate.sh
  ./makeConnection.sh
  
  # create orgs wallets
  node makeWallet.js
}

function networkUp() {
  checkPrereqs

  # generate artifacts if they don't exist
  if [ ! -d "organizations/peerOrganizations" ]; then
    createOrgs
  fi

  COMPOSE_FILES="-f compose/compose-test-net.yaml -f compose/docker/docker-compose-test-net.yaml"

  COMPOSE_FILES="${COMPOSE_FILES} -f compose/compose-couch.yaml -f compose/docker/docker-compose-couch.yaml"

  DOCKER_SOCK="${DOCKER_SOCK}" docker-compose ${COMPOSE_FILES} up -d 2>&1

  docker ps -a
  if [ $? -ne 0 ]; then
    fatalln "Unable to start network"
  fi
}

# call the script to create the channel, join the peers of org1 org2,
# then update the anchor peers for each organization
function createChannel() {
  # Bring up the network if it is not already up.
  bringUpNetwork="false"

  if ! docker info >/dev/null 2>&1; then
    fatalln "docker network is required to be running to create a channel"
  fi

  # check if all containers are present
  CONTAINERS=($(docker ps | grep hyperledger/ | awk '{print $2}'))
  len=$(echo ${#CONTAINERS[@]})

  if [[ $len -ge 4 ]] && [[ ! -d "organizations/peerOrganizations" ]]; then
    echo "Bringing network down to sync certs with containers"
    networkDown
  fi

  [[ $len -lt 4 ]] || [[ ! -d "organizations/peerOrganizations" ]] && bringUpNetwork="true" || echo "Network Running Already"

  if [ $bringUpNetwork == "true" ]; then
    infoln "Bringing up network"
    networkUp
  fi

  # now run the script that creates a channel. This script uses configtxgen once
  # to create the channel creation transaction the anchor peer updates.
  scripts/createChannel.sh mychannel $CLI_DELAY $MAX_RETRY $VERBOSE
}

## Call the script to deploy a chaincode to the channel
function deployCC() {

  scripts/deployCC.sh mychannel batches-contract ../batches-contract node 1.0 1 NA $CLI_DELAY $MAX_RETRY $VERBOSE
  scripts/deployCC.sh mychannel drugs-contract ../drugs-contract node 1.0 1 init $CLI_DELAY $MAX_RETRY $VERBOSE

  if [ $? -ne 0 ]; then
    fatalln "Deploying chaincode failed"
  fi
}

# Tear down running network
function networkDown() {

  COMPOSE_BASE_FILES="-f compose/compose-test-net.yaml -f compose/docker/docker-compose-test-net.yaml"
  COMPOSE_COUCH_FILES="-f compose/compose-couch.yaml -f compose/docker/docker-compose-couch.yaml"
  COMPOSE_CA_FILES="-f compose/compose-ca.yaml -f compose/docker/docker-compose-ca.yaml"
  COMPOSE_FILES="${COMPOSE_BASE_FILES} ${COMPOSE_COUCH_FILES} ${COMPOSE_CA_FILES}"

  DOCKER_SOCK=$DOCKER_SOCK docker-compose ${COMPOSE_FILES} down --volumes --remove-orphans

  # Don't remove the generated artifacts -- note, the ledgers are always removed

  # Bring down the network, deleting the volumes
  docker volume rm docker_orderer0.example.com docker_peer0.org1.example.com docker_peer0.org2.example.com
  #Cleanup the chaincode containers
  clearContainers
  #Cleanup images
  removeUnwantedImages
  #
  docker kill $(docker ps -q --filter name=ccaas) || true
  # remove orderer block other channel configuration transactions certs
  docker run --rm -v "$(pwd):/data" busybox sh -c 'cd /data && rm -rf system-genesis-block/*.block organizations/peerOrganizations organizations/ordererOrganizations'
  ## remove fabric ca artifacts
  docker run --rm -v "$(pwd):/data" busybox sh -c 'cd /data && rm -rf organizations/fabric-ca/org1/msp organizations/fabric-ca/org1/tls-cert.pem organizations/fabric-ca/org1/ca-cert.pem organizations/fabric-ca/org1/IssuerPublicKey organizations/fabric-ca/org1/IssuerRevocationPublicKey organizations/fabric-ca/org1/fabric-ca-server.db'
  docker run --rm -v "$(pwd):/data" busybox sh -c 'cd /data && rm -rf organizations/fabric-ca/org2/msp organizations/fabric-ca/org2/tls-cert.pem organizations/fabric-ca/org2/ca-cert.pem organizations/fabric-ca/org2/IssuerPublicKey organizations/fabric-ca/org2/IssuerRevocationPublicKey organizations/fabric-ca/org2/fabric-ca-server.db'
  docker run --rm -v "$(pwd):/data" busybox sh -c 'cd /data && rm -rf organizations/fabric-ca/org3/msp organizations/fabric-ca/org3/tls-cert.pem organizations/fabric-ca/org3/ca-cert.pem organizations/fabric-ca/org3/IssuerPublicKey organizations/fabric-ca/org3/IssuerRevocationPublicKey organizations/fabric-ca/org3/fabric-ca-server.db'

  docker run --rm -v "$(pwd):/data" busybox sh -c 'cd /data && rm -rf organizations/fabric-ca/ordererOrg/msp organizations/fabric-ca/ordererOrg/tls-cert.pem organizations/fabric-ca/ordererOrg/ca-cert.pem organizations/fabric-ca/ordererOrg/IssuerPublicKey organizations/fabric-ca/ordererOrg/IssuerRevocationPublicKey organizations/fabric-ca/ordererOrg/fabric-ca-server.db'
  # remove channel script artifacts
  docker run --rm -v "$(pwd):/data" busybox sh -c 'cd /data && rm -rf channel-artifacts log.txt *.tar.gz'

  # remove orgs wallets

  rm -r ../org1wallet
  rm -r ../org2wallet
  rm -r ../ordererwallet

  # remove profile for vscode extensions (IBM)

  rm networkProfile.json
}


# timeout duration - the duration the CLI should wait for a response from
# another container before giving up
MAX_RETRY=5
# default for delay between commيs
CLI_DELAY=3

# Get docker sock path from environment variable
SOCK="${DOCKER_HOST:-/var/run/docker.sock}"
DOCKER_SOCK="${SOCK##unix://}"



MODE=$1
  
if [ "$MODE" == "up" ]; then
  infoln "Starting nodes with CLI timeout of '${MAX_RETRY}' tries CLI delay of '${CLI_DELAY}' seconds using database '${DATABASE}'"
  networkUp
  infoln "Creating channel 'mychannel'."
  createChannel
  infoln "deploying chaincode on channel 'mychannel'"
  deployCC
elif [ "$MODE" == "down" ]; then
  infoln "Stopping network"
  networkDown
fi
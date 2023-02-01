#!/usr/bin/env bash

../network/organizations/ccp-generate.sh

${AS_LOCAL_HOST:=true}

: "${TEST_NETWORK_HOME:=../network}"

: "${CONNECTION_PROFILE_FILE_ORG1:=${TEST_NETWORK_HOME}/organizations/peerOrganizations/org1.example.com/connection-org1.json}"
: "${CERTIFICATE_FILE_ORG1:=${TEST_NETWORK_HOME}/organizations/peerOrganizations/org1.example.com/users/User1@org1.example.com/msp/signcerts/*}"
: "${PRIVATE_KEY_FILE_ORG1:=${TEST_NETWORK_HOME}/organizations/peerOrganizations/org1.example.com/users/User1@org1.example.com/msp/keystore/*}"

: "${CONNECTION_PROFILE_FILE_ORG2:=${TEST_NETWORK_HOME}/organizations/peerOrganizations/org2.example.com/connection-org2.json}"
: "${CERTIFICATE_FILE_ORG2:=${TEST_NETWORK_HOME}/organizations/peerOrganizations/org2.example.com/users/User1@org2.example.com/msp/signcerts/*}"
: "${PRIVATE_KEY_FILE_ORG2:=${TEST_NETWORK_HOME}/organizations/peerOrganizations/org2.example.com/users/User1@org2.example.com/msp/keystore/*}"

: "${CONNECTION_PROFILE_FILE_ORG3:=${TEST_NETWORK_HOME}/organizations/peerOrganizations/org3.example.com/connection-org3.json}"
: "${CERTIFICATE_FILE_ORG3:=${TEST_NETWORK_HOME}/organizations/peerOrganizations/org3.example.com/users/User1@org3.example.com/msp/signcerts/*}"
: "${PRIVATE_KEY_FILE_ORG3:=${TEST_NETWORK_HOME}/organizations/peerOrganizations/org3.example.com/users/User1@org3.example.com/msp/keystore/*}"


cat << ENV_END > .env
# Generated .env file
# See src/config.ts for details of all the available configuration variables
#

LOG_LEVEL=info

PORT=3000

HLF_CERTIFICATE_ORG1="$(cat ${CERTIFICATE_FILE_ORG1} | sed -e 's/$/\\n/' | tr -d '\r\n')"

HLF_PRIVATE_KEY_ORG1="$(cat ${PRIVATE_KEY_FILE_ORG1} | sed -e 's/$/\\n/' | tr -d '\r\n')"

HLF_CERTIFICATE_ORG2="$(cat ${CERTIFICATE_FILE_ORG2} | sed -e 's/$/\\n/' | tr -d '\r\n')"

HLF_PRIVATE_KEY_ORG2="$(cat ${PRIVATE_KEY_FILE_ORG2} | sed -e 's/$/\\n/' | tr -d '\r\n')"

HLF_CERTIFICATE_ORG3="$(cat ${CERTIFICATE_FILE_ORG3} | sed -e 's/$/\\n/' | tr -d '\r\n')"

HLF_PRIVATE_KEY_ORG3="$(cat ${PRIVATE_KEY_FILE_ORG3} | sed -e 's/$/\\n/' | tr -d '\r\n')"



REDIS_PORT=6379





ENV_END
 
if [ "${AS_LOCAL_HOST}" = "true" ]; then

cat << LOCAL_HOST_END >> .env
AS_LOCAL_HOST=true

HLF_CONNECTION_PROFILE_ORG1=$(cat ${CONNECTION_PROFILE_FILE_ORG1} | jq -c .)

HLF_CONNECTION_PROFILE_ORG2=$(cat ${CONNECTION_PROFILE_FILE_ORG2} | jq -c .)
HLF_CONNECTION_PROFILE_ORG3=$(cat ${CONNECTION_PROFILE_FILE_ORG3} | jq -c .)





REDIS_HOST=localhost

LOCAL_HOST_END

elif [ "${AS_LOCAL_HOST}" = "false" ]; then

cat << WITH_HOSTNAME_END >> .env
AS_LOCAL_HOST=false

HLF_CONNECTION_PROFILE_ORG1=$(cat ${CONNECTION_PROFILE_FILE_ORG1} | jq -c '.peers["peer0.org1.example.com"].url = "grpcs://peer0.org1.example.com:7051" | .certificateAuthorities["ca.org1.example.com"].url = "https://ca.org1.example.com:7054"')

HLF_CONNECTION_PROFILE_ORG2=$(cat ${CONNECTION_PROFILE_FILE_ORG2} | jq -c '.peers["peer0.org2.example.com"].url = "grpcs://peer0.org2.example.com:9051" | .certificateAuthorities["ca.org2.example.com"].url = "https://ca.org2.example.com:8054"')
HLF_CONNECTION_PROFILE_ORG3=$(cat ${CONNECTION_PROFILE_FILE_ORG3} | jq -c '.peers["peer0.org3.example.com"].url = "grpcs://peer0.org3.example.com:11051" | .certificateAuthorities["ca.org3.example.com"].url = "https://ca.org3.example.com:11054"')


REDIS_HOST=redis

WITH_HOSTNAME_END

fi

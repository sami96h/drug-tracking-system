#!/bin/bash
#
# Copyright IBM Corp All Rights Reserved
#
# SPDX-License-Identifier: Apache-2.0
#

# ./network.sh up createChannel -ca -s couchdb
# docker stop $(docker ps -q --filter name=redis)
# docker rm -f $(docker ps -aq --filter name=redis)
# cd ../demo-application && npm run dev

./network.sh up
./network.sh createChannel
./network.sh deployCC


cd ../demo-application
npm run dev

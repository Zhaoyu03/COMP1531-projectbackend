#!/usr/bin/env bash

WORKING_DIRECTORY="~/www/h15caero"

USERNAME="h15caero"
SSH_HOST="ssh-h15caero.alwaysdata.net"

scp -r ./package.json ./package-lock.json ./tsconfig.json ./src ./profilePics ./resources "$USERNAME@$SSH_HOST:$WORKING_DIRECTORY"
ssh "$USERNAME@$SSH_HOST" "cd $WORKING_DIRECTORY && npm install --only=production"


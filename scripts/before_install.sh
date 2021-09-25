#!/bin/bash

#download node and npm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.38.0/install.sh | bash
. ~/.nvm/nvm.sh

#create working directory if it doesnt exist
DIR="/home/ec2-user/express_app"
if [ -d "$DIR" ]; then
    echo "${DIR} exists"
else
    echo "Create ${DIR} directory"
    mkdir ${DIR}
fi   
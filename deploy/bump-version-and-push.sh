#!/bin/bash
set -e

BUMP_VERSION=1
PUSH_TO_DOCKER=1

if [ $BUMP_VERSION = 1 ]
then
    echo Bumping version.
    npm version patch --force
else
    echo Not bumping version.
fi

PACKAGE_VERSION=$(cat package.json \
  | grep version \
  | head -1 \
  | awk -F: '{ print $2 }' \
  | sed 's/[",]//g' \
  | tr -d '[[:space:]]')

echo Version is now ${PACKAGE_VERSION}.
TAG=dedm-v${PACKAGE_VERSION}
CONTAINER_IMAGE=bulankou/scratch:$TAG
echo Container image is ${CONTAINER_IMAGE}.

if [ $PUSH_TO_DOCKER = 1 ]
then
    if [ "$(uname)" == "Darwin" ]
    then
        docker build -t $CONTAINER_IMAGE .
        docker push $CONTAINER_IMAGE
    else
        sudo docker build -t $CONTAINER_IMAGE .
        sudo docker push $CONTAINER_IMAGE
    fi
else
    echo Not pushing to docker.
fi
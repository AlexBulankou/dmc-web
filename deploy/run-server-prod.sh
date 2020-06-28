#!/bin/bash
set -e

if [ -z "$1" ]
then
   echo "No input tag specified. Running bump-version-and-push.sh"
   source deploy/bump-version-and-push.sh
   echo "TAG is "${TAG}.
   echo "Container image is "${CONTAINER_IMAGE}.
else
    TAG=$1
    echo "Tag is specified: "${TAG}.
    CONTAINER_IMAGE=bulankou/scratch:$TAG
    echo Container image is ${CONTAINER_IMAGE}.
fi

rm -rf deploy/server-dedm-v*
DEPLOY_FILE_PATH=deploy/server-$TAG.yaml
cp -rf deploy/server.yaml $DEPLOY_FILE_PATH

if [ "$(uname)" == "Darwin" ]
    then
        sed -i '' "s|__Y_IMAGE__|$CONTAINER_IMAGE|g" $DEPLOY_FILE_PATH
    else
        sed -i  "s|__Y_IMAGE__|$CONTAINER_IMAGE|g" $DEPLOY_FILE_PATH
    fi

#gcloud auth login
export PROJECT_ID=[...]
gcloud config set project $PROJECT_ID
gcloud container clusters get-credentials cluster-1 --zone=us-central1-b

kubectl apply -f $DEPLOY_FILE_PATH
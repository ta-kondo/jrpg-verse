#!/bin/bash
# --------------------------------------------------------------------
function message() {
    printf '\033[31m%s\033[m\n' "$1"
}
function cleanup() {
    echo
    echo --- Clean ---
    message "docker rmi $TAG_NAME"
    docker rmi "$TAG_NAME"
    echo
}

# ----------------------------
# Names
REPOSITORY_NAME="jrpg-verse"
IMAGE_NAME="jrpg-verse-image"

if [[ "$TAG" == "" ]]; then
    TAG="latest"
fi

ERROR=0
if $(gcloud --version > /dev/null); then :
else
    message "GCP command line tool (gcloud) must be installed and configured"
    echo
    exit 1
fi
if [[ "$GCP_PROJECT" == "" ]]; then
    message "set environment variable GCP_PROJECT"
    message "GCP_PROJECT=< your gcp project name: e.g. iron-potion-999999 >"
    echo
    exit 1
fi
if [[ "$GCP_REGION" == "" ]]; then
    GCP_REGION=$(gcloud config get-value "compute/region")
fi

# ----------------------------
# Path
SCRIPT_DIR=$(cd $(dirname $0); pwd)
pushd $(cd $SCRIPT_DIR/../; pwd) >/dev/null

# ----------------------------
# Build container image
TAG_NAME="${GCP_REGION}-docker.pkg.dev/$GCP_PROJECT/$REPOSITORY_NAME/$IMAGE_NAME:$TAG"
if [[ "$ERROR" -eq "0" ]]; then
    echo
    message "docker build --rm --file ./frontend/docker/Dockerfile.prd --tag $TAG_NAME ./frontend"
    echo
    docker build --rm --file ./frontend/docker/Dockerfile.prd --tag $TAG_NAME ./frontend
    ERROR=$?
fi

# ----------------------------
# Push to repository
if [[ "$ERROR" -eq "0" ]]; then
    echo
    message "docker push $TAG_NAME"
    echo
    docker push "$TAG_NAME"
    ERROR=$?
fi

# ----------------------------
# Clean
cleanup

# ----------------------------
# Terminate
echo
if [[ "$ERROR" -ne "0" ]]; then
    message "----------- Failed ($ERROR) -----------"
    echo
    exit 1
fi

message "----------- Succeeded -----------"
echo
exit 0

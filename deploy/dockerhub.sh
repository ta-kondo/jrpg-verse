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

if [[ "$TAG" == "" ]]; then
    TAG="latest"
fi

ERROR=0
if [[ "$USER_DOCKERHUB" == "" ]]; then
    message "set environment variable USER_DOCKERHUB"
    message "USER_DOCKERHUB=<your dockerhub account>"
    echo
    exit 1
fi

# ----------------------------
# Path
SCRIPT_DIR=$(cd $(dirname $0); pwd)
pushd $(cd $SCRIPT_DIR/../; pwd) >/dev/null

# ----------------------------
# Build container image
TAG_NAME="$USER_DOCKERHUB/$REPOSITORY_NAME:$TAG"
if [[ "$ERROR" -eq "0" ]]; then
    echo
    message "docker build --rm --file ./frontend/docker/Dockerfile.prd --tag $TAG_NAME ./frontend"
    echo
    docker build --rm --file ./frontend/docker/Dockerfile.prd --tag $TAG_NAME ./frontend
    ERROR=$?
fi

# ----------------------------
# Login DockerHub
if [[ "$ERROR" -eq "0" ]]; then
    echo
    message "docker login --username $USER_DOCKERHUB"
    echo
    docker login --username $USER_DOCKERHUB
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

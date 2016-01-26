#!/bin/bash

BRANCH_NAME=$1

if [ -z $BRANCH_NAME ]; then
	echo "Usage: deploy-branch branch-name"
	exit 1
fi

echo "INFO: checking out ${BRANCH_NAME}"
git checkout $BRANCH_NAME
if [ $? -ne 0 ]; then
	echo "ERROR: unable to checkout branch $BRANCH_NAME"
	exit 1
fi

echo "INFO: pushing ${BRANCH_NAME} to openshift remote repository"
git push -u origin $BRANCH_NAME
if [ $? -ne 0 ]; then
	echo "ERROR: unable to push ${BRANCH_NAME} to remote"
	exit 1
fi

echo "INFO: deploying from branch ${BRANCH_NAME}"
rhc deploy $BRANCH_NAME -a WebDevelopment
if [ $? -ne 0 ]; then
	echo "ERROR: failure deploying from ${BRANCH_NAME}.  Falling back to master"
	rhc deploy master -a WebDevelopment
	if [ $? -ne 0 ]; then
		echo "ERROR: failure deploying master" # this should NEVER happen, master is expected to be clean
	else
		echo "INFO: successfully deployed branch master"
	fi
else
	echo "INFO: branch ${BRANCH_NAME} deployed successfully"
	echo "INFO: feel free to merge ${BRANCH_NAME} into master"
fi

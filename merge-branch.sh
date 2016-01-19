#!/bin/bash

BRANCH_NAME=$1

if [ -z $BRANCH_NAME ]; then
	echo "Usage: merge-branch branch-name"
	exit 1
fi

# checkout master
git checkout master
if [ $? -ne 0 ]; then
	echo "ERROR: unable to checkout branch master"
	exit 1
fi

# merge in our branch
git merge $BRANCH_NAME
if [ $? -ne 0 ]; then
	echo "ERROR: unable to merge branch $BRANCH_NAME with master"
	exit 1
else:
	echo "INFO: branch ${BRANCH_NAME} successfully merged into openshift master"
fi

# push changes to openshift
git push -u origin master
if [ $? -ne 0 ]; then
	echo "ERROR: unable to push changes to openshift remote"
	exit 1
else:
	echo "INFO: local changes successfully pushed to openshift master"

# deploy master
rhc deploy master -a WebDevelopment
if [ $? -ne 0 ]; then
	echo "ERROR: unable to deploy branch master" # should never happen, this script is only run after successful deploy
	exit 1
else:
	echo "INFO: openshift master branch successfully delpoyed"
fi

# push to github
git push -u github master
if [ $? -ne 0 ]; then
	echo "ERROR: unable to push changes to github remote"
	exit 1
else:
	echo "INFO: openshift master branch successfully pushed to github"
fi
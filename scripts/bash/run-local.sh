#!/bin/bash

## Run this project locally.
## ASSUMES: mongod running at default port
## ASSUMES: script run from root directory (run via 'npm start')

## Install all typescript dependencies
echo "INFO: running 'typings install'"
typings install

## Compile gulpfile into js
echo "INFO: running 'tsc' to generate gulpfile.js"
tsc

## Build the project via gulp
echo "INFO: Running 'gulp' (default task)"
gulp

## start up the server
node dist/server.js
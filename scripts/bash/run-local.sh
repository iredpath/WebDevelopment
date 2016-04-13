#!/bin/bash

## Run this project locally.
## ASSUMES: mongod running at default port
## ASSUMES: script run from root directory (run via 'npm start')

## Install all node/js dependencies
echo "INFO: running npm install"
npm install

## Install all typescript dependencies
echo "INFO: running 'typings install'"
typings install

## Some stupidity here to simplify my git repo
## For some reason, angular2 is only available via npm
## This means the type definitions file needs to be added
##   to the parent typings definition file manually
echo "INFO: adding angular2 dependencies to type definition files"
echo '/// <reference path="../node_modules/angular2/typings/browser.d.ts" />' >> typings/browser.d.ts
echo '/// <reference path="../node_modules/angular2/typings/browser.d.ts" />' >> typings/main.d.ts

## Compile gulpfile into js
echo "INFO: running 'tsc' to generate gulpfile.js"
tsc gulpfile.ts --module commonjs --experimentalDecorators

## Build the project via gulp
echo "INFO: Running 'gulp' (default task)"
gulp

## start up the server
node dist/server.js
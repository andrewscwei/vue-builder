#!/bin/bash

PACKAGE_NAME=$(cat package.json | jq -r ".name")
PACKAGE_VERSION=$(cat package.json | jq -r ".version")
PACKAGE_FILE=$PACKAGE_NAME-$PACKAGE_VERSION.zip
NETLIFY_API=https://api.netlify.com/api/v1

# Color functions.
function red() { echo "\x1b[0;31m${1}\x1b[0m"; }
function green() { echo "\x1b[0;32m${1}\x1b[0m"; }
function yellow() { echo "\x1b[0;33m${1}\x1b[0m"; }
function blue() { echo "\x1b[0;34m${1}\x1b[0m"; }
function purple() { echo "\x1b[0;35m${1}\x1b[0m"; }
function cyan() { echo "\x1b[0;36m${1}\x1b[0m"; }
function grey() { echo "\x1b[0;37m${1}\x1b[0m"; }

#!/bin/bash

source $(dirname $0)/getopts.sh

# Check if build exists.
if [ ! -d ${PUBLIC_DIR:-dist} ]; then
  echo "No build found in ${PUBLIC_DIR:-dist}"
  exit 0
fi

echo "Generating build archive..."

# Compress build into .zip file.
mkdir -p build
zip -r build/$PACKAGE_FILE ${PUBLIC_DIR:-dist}

echo -e "Successfully generated archive at $(cyan "$(pwd)/build/$PACKAGE_FILE")"

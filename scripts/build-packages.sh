#!/bin/bash
# Script to rebuild packages
. ./scripts/build-vars.sh
echo Rebuilding packages...
echo Rebuilding node-sass...
./scripts/build-node-sass.sh
echo Rebuilding tara-explorer/ffi...
cd $PACKAGE_DIR/tara-explorer
cd node_modules/ffi
echo "> npm install"
npm install
echo ""
echo Rebuilding tara-explorer/ref...
cd ../ref
echo "> npm install"
npm install
echo ""
echo "Done."

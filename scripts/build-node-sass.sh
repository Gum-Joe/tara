#!/bin/bash
# Script to build node-sass for electron
. ./scripts/build-vars.sh

echo "Building node-sass for electron..."
cd node_modules/node-sass
echo "Removing old bindings..."
echo "> rm -rf vendor/."
rm -rfv vendor
echo ""
echo "> mkdir vendor"
mkdir -v vendor
echo ""
echo "Building new ones..."
echo "mkdir ~/.electron-gyp"
mkdir -v ~/.electron-gyp
echo ""
echo "> HOME=~/.electron-gyp npm run build"
HOME=~/.electron-gyp npm run build
echo ""
echo "Renaming correctly..."
cd vendor
export CURRENT_NAME=$(ls)
export CURRENT_NUMBER="${CURRENT_NAME:$((${#CURRENT_NAME}-2)):1}""${CURRENT_NAME:$((${#CURRENT_NAME}-1)):1}" # From http://stackoverflow.com/questions/17542892/how-to-get-the-last-character-of-a-string-in-a-shell
export NEW_NAME=$(echo "$CURRENT_NAME" | tr "$CURRENT_NUMBER" "$electron_id")
echo "> mv $CURRENT_NAME $NEW_NAME"
mv -v $CURRENT_NAME $NEW_NAME
echo ""
echo "Done."

#!/bin/bash
# Script to build node-sass for electron
. ./scripts/build-vars.sh

echo "Building node-sass for electron..."
echo "Copying old node-sass bindings..."
echo "> cp -av node_modules/node-sass/vendor/. .node-sass-backup/"
cp -av node_modules/node-sass/vendor/. .node-sass-backup/
#echo "Removing old bindings..."
#echo "> rm -rf vendor/."
#rm -rfv vendor
echo ""
echo "Rebuilding node-sass..."
echo "> mkdir ~/.electron-gyp"
mkdir -v ~/.electron-gyp
echo "> npm rebuild -f node-sass"
HOME=~/.electron-gyp npm rebuild -f node-sass
echo ""
echo "Renaming..."
cd node_modules/node-sass/vendor
export CURRENT_NAME=$(ls)
export CURRENT_NUMBER="${CURRENT_NAME:$((${#CURRENT_NAME}-2)):1}""${CURRENT_NAME:$((${#CURRENT_NAME}-1)):1}" # From http://stackoverflow.com/questions/17542892/how-to-get-the-last-character-of-a-string-in-a-shell
export NEW_NAME=$(echo "$CURRENT_NAME" | tr "$CURRENT_NUMBER" "$electron_id")
echo "> mv $CURRENT_NAME $NEW_NAME"
mv $CURRENT_NAME $NEW_NAME
echo ""
echo "Copying old dirs.."
echo "> cp -av ../../../.node-sass-backup/. ./"
cp -av ../../../.node-sass-backup/. ./
echo ""
echo "Done."

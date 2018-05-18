#!/usr/bin/bash
# Build src/packages for tara

echo "Bootstrapping modules to install dependencies..."
yarn run bootstrap

echo "Building packages..."
cd ./src/packages
echo "Packages:"
ls
echo ""
cd ./tara-core
yarn build
cd ../tara-right-click-menu
yarn build
cd ../tara-file-operations
yarn build
cd ../tara-explorer
yarn build
cd ../one-fluent-theme
yarn build
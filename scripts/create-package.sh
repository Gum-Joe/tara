#!/usr/bin/bash
# Script to make a new lerna package
# Stores in src/packages
# $1: Package name

echo "Generating package $1..."
echo "> mkdir src/packages/$1"
mkdir -v src/packages/$1
echo ""
echo "Copying baseline package.json..."
echo "> cp scripts/defaults/default-package.json src/packages/$1/package.json"

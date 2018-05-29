#!/usr/bin/env bash
# File to contain electron build vars
# Electron's version.
export npm_config_target=2.0.0
# The architecture of Electron, can be ia32 or x64.
export npm_config_arch=x64
export npm_config_target_arch=x64
# Download headers for Electron.
export npm_config_disturl=https://atom.io/download/electron
# Tell node-pre-gyp that we are building for Electron.
export npm_config_runtime=electron
# Tell node-pre-gyp to build module from source code.
export npm_config_build_from_source=true
# Electron's node ID
export electron_id=57
# Package dir
export PACKAGE_DIR=src/packages
  
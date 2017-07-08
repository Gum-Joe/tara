# out: ../lib/index.js, sourcemap: true
###
# @overview Contains the entry point for the right click context menu
# @module tara-right-click-menu
###
{ app, remote } = require "electron"
{ join } = require "path"
rimraf = require "rimraf"
{ TARA_CONFIG_DBS } = require "../../../renderer/constants"
app = remote.app if typeof app is "undefined"

module.exports.main = (tara) ->
  tara.logger.debug "Loaded tara-right-click-menu."
  app.on("window-all-closed", () ->
    tara.logger.debug "Removing context menu dbs..."
    # Rm old stuff
    rimraf.sync TARA_CONFIG_DBS
  );

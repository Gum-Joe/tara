# out: ../lib/index.js, sourcemap: true
###
# @overview Contains the entry point for the right click context menu
# @module tara-right-click-menu
###
{ join } = require "path"

module.exports.main = (tara) ->
  tara.logger.debug "Loaded tara-right-click-menu."

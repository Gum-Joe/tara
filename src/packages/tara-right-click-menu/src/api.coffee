# out: ../lib/api.js, sourcemap: true
###
# @overview Api for context menu
# @module tara-right-click-menu
###
Menu = require "./menu"

module.exports = {
  ###
  # Create a menu
  # @param {String} name Name of menu
  # @returns {Menu} Tara Menu class
  ###
  createMenu: (name) => new Menu(name)
}

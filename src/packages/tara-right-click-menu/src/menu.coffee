# out: ../lib/menu.js, sourcemap: true
###
# @overview Menu Class
# @module tara-right-click-menu
###
{ Menu, MenuItem, remote } = require "electron" if typeof window == "undefined"
if typeof window != "undefined"
  { remote } = require "electron"
  { Menu, MenuItem } = remote

###
# Menu class
# @class
###
class TaraMenu

  constructor: () ->
    # Menu items
    @Item = MenuItem
    @menu = new Menu()

  ###
  # Run the menu if a certain statement is met
  # @param {Function} test Function to return either true or false for whether or not to pop up
  # @returns {void} Nothing
  ###
  applyIf: (test) ->
    @checkApply = test

  ###
  # Start listenning for the event
  # @returns {void} Nothing
  ###
  listen: () ->
    console.log "Now listenning (menu)"
    that = @
    window.addEventListener('contextmenu', (event) ->
      event.preventDefault()
      if that.checkApply(event)
        that.menu.popup(remote.getCurrentWindow())
    , false)

module.exports = TaraMenu;

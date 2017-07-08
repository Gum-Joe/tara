# out: ../lib/menu.js, sourcemap: true
###
# @overview Menu Class
# @module tara-right-click-menu
###
{ Menu, MenuItem, remote } = require "electron" if typeof window == "undefined"
{ join } = require "path"
{ eachSeries } = require "async"
{ TARA_CONFIG_DBS } = require "../../../renderer/constants"
DB = require "nedb"
if typeof window != "undefined"
  { remote } = require "electron"
  { Menu, MenuItem } = remote

# TMP store db
tmp = new DB({ filename: join(TARA_CONFIG_DBS, "right-click-context-menu", "tmp.db"), autoload: true })
tmp.insert({ idCount: 0 })

###
# Menu class
# @param {String} name Name of db
# @class
###
class TaraMenu

  constructor: (name) ->
    # Menu items
    @Item = MenuItem
    @menu = new Menu()
    # Create db for menus
    @name = name
    @db = new DB({ filename: join(TARA_CONFIG_DBS, "right-click-context-menu", "#{@name}.db"), autoload: true })

  ###
  # Run the menu if a certain statement is met
  # @param {Function} test Function to return either true or false for whether or not to pop up
  # @returns {void} Nothing
  ###
  applyIf: (test) ->
    @checkApply = test

  ###
  # Appends item to menu db
  # @param {object} item Menu item
  ###
  append: (item) ->
    db = @db
    # Check if item is already there
    db.find({ item }, (err, docs) ->
      throw err if err
      # Look for next id
      tmp.find({ idCount: { $exists: true }}, (err, count) ->
        throw err if err
        # Insert
        if docs.length == 0
          db.insert({ item, id: count[0].idCount || item.id });
          # Update ID count
          tmp.update({ idCount: /.*/ }, { $set: { idCount: count[0].idCount++ || item.id++  } }, {}, (err) -> throw err if err)
      )
    )

  ###
  # Start listenning for the event
  # @returns {void} Nothing
  ###
  listen: () ->
    console.log "Now listenning (menu)"
    that = @
    window.addEventListener('contextmenu', (event) ->
      event.preventDefault()
      # Remake menu from db
      db = new DB({ filename: join(TARA_CONFIG_DBS, "right-click-context-menu", "#{that.name}.db"), autoload: true })
      db.find({}, (err, docs) ->
        throw err if err
        menu = new Menu()
        toAppend = [];
        for item in docs
          # Resolve click & append to to append array (in order)
          item.item.click = require item.item.click if item.item.hasOwnProperty "click"
          toAppend[item.id] = new MenuItem(item.item)
        # Add to menu add popup when done
        eachSeries(toAppend, (item, callback) ->
          menu.append(item)
          callback()
        , () ->
          menu.popup(remote.getCurrentWindow())
        )
      )
    , false)

module.exports = TaraMenu;

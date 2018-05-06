/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
// out: ../lib/menu.js, sourcemap: true
/*
 * @overview Menu Class
 * @module tara-right-click-menu
 */
let Menu,
  MenuItem,
  remote;
const { join } = require("path");
const { eachSeries } = require("async");
const { TARA_CONFIG_DBS } = require("tara-core/lib/constants.js");
const DB = require("nedb");
if (typeof window === "undefined") { 
  ({ Menu, MenuItem, remote } = require("electron"));
}
if (typeof window !== "undefined") {
  ({ remote } = require("electron"));
  ({ Menu, MenuItem } = remote);
}

// TMP store db
const tmp = new DB({ filename: join(TARA_CONFIG_DBS, "right-click-context-menu", "tmp.db"), autoload: true });
tmp.insert({ idCount: 0 });

/*
 * Menu class
 * @param {String} name Name of db
 * @class
 */
class TaraMenu {
  constructor(name) {
    // Menu items
    this.Item = MenuItem;
    this.menu = new Menu();
    // Create db for menus
    this.name = name;
    this.db = new DB({ filename: join(TARA_CONFIG_DBS, "right-click-context-menu", `${this.name}.db`), autoload: true });
  }

  /*
   * Run the menu if a certain statement is met
   * @param {Function} test Function to return either true or false for whether or not to pop up
   * @returns {void} Nothing
   */
  applyIf(test) {
    this.checkApply = test;
  }

  /*
   * Appends item to menu db
   * @param {object} item Menu item
   */
  append(item) {
    const { db } = this;
    // Check if item is already there
    return db.find({ item }, (err, docs) => {
      if (err) { throw err; }
      // Look for next id
      return tmp.find({ idCount: { $exists: true } }, (err, count) => {
        if (err) { throw err; }
        // Insert
        if (docs.length === 0) {
          db.insert({ item, id: count[0].idCount || item.id });
          // Update ID count
          return tmp.update({ idCount: /.*/ }, { $set: { idCount: count[0].idCount++ || item.id++  } }, {}, err => { if (err) { throw err; } });
        }
      });
    });
  }

  /*
   * Start listenning for the event
   * @returns {void} Nothing
   */
  listen() {
    console.log("Now listenning (menu)");
    //const that = this;
    window.addEventListener("contextmenu", event => {
      event.preventDefault();
      // Remake menu from db
      const db = new DB({ filename: join(TARA_CONFIG_DBS, "right-click-context-menu", `${this.name}.db`), autoload: true });
      return db.find({}, (err, docs) => {
        if (err) { throw err; }
        const template = [];
        for (let item of Array.from(docs)) {
          // Resolve click & append to to append array (in order)
          if (item.item.hasOwnProperty("click")) { item.item.click = require(item.item.click); }
          item.item.id = item.item.id;
          item.item = new MenuItem(item.item);
          template[item.item.id] = item.item;
        }
        const menu = Menu.buildFromTemplate(template);
        return menu.popup(remote.getCurrentWindow());
        // Add to menu add popup when done
        /*
        eachSeries(docs, (item, callback) ->
          console.log item
          menu.append(item.item)
          callback()
        , () ->
          menu.popup(remote.getCurrentWindow())
        )
        */
      });
    }
    , false);
  }
}

module.exports = TaraMenu;

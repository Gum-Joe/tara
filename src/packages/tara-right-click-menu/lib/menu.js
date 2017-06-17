
/*
 * @overview Menu Class
 * @module tara-right-click-menu
 */

(function() {
  var Menu, MenuItem, TaraMenu, ref, remote;

  if (typeof window === "undefined") {
    ref = require("electron"), Menu = ref.Menu, MenuItem = ref.MenuItem, remote = ref.remote;
  }

  if (typeof window !== "undefined") {
    remote = require("electron").remote;
    Menu = remote.Menu, MenuItem = remote.MenuItem;
  }


  /*
   * Menu class
   * @class
   */

  TaraMenu = (function() {
    function TaraMenu() {
      this.Item = MenuItem;
      this.menu = new Menu();
    }


    /*
     * Run the menu if a certain statement is met
     * @param {Function} test Function to return either true or false for whether or not to pop up
     * @returns {void} Nothing
     */

    TaraMenu.prototype.applyIf = function(test) {
      return this.checkApply = test;
    };


    /*
     * Start listenning for the event
     * @returns {void} Nothing
     */

    TaraMenu.prototype.listen = function() {
      var that;
      console.log("Now listenning (menu)");
      that = this;
      return window.addEventListener('contextmenu', function(event) {
        event.preventDefault();
        if (that.checkApply(event)) {
          return that.menu.popup(remote.getCurrentWindow());
        }
      }, false);
    };

    return TaraMenu;

  })();

  module.exports = TaraMenu;

}).call(this);

//# sourceMappingURL=menu.js.map
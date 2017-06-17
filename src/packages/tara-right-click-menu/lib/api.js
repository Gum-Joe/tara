
/*
 * @overview Api for context menu
 * @module tara-right-click-menu
 */

(function() {
  var Menu;

  Menu = require("./menu");

  module.exports = {

    /*
     * Create a menu
     * @returns {Menu} Tara Menu class
     */
    createMenu: (function(_this) {
      return function() {
        return new Menu();
      };
    })(this)
  };

}).call(this);

//# sourceMappingURL=api.js.map
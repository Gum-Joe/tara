
/*
 * @overview Contains the entry point for the right click context menu
 * @module tara-right-click-menu
 */

(function() {
  var join;

  join = require("path").join;

  module.exports.main = function(tara) {
    tara.logger.debug("Loaded tara-right-click-menu");
    return tara.getClient().loadScript(join(tara.getPluginPathSync(tara.plugin.name), "lib/browser.js"));
  };

}).call(this);

//# sourceMappingURL=index.js.map
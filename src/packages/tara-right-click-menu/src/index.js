/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
// out: ../lib/index.js, sourcemap: true
/*
 * @overview Contains the entry point for the right click context menu
 * @module tara-right-click-menu
 */
let { app, remote } = require("electron");
const { join } = require("path");
const rimraf = require("rimraf");
const { TARA_CONFIG_DBS } = require("tara-core/lib/constants.js");
if (typeof app === "undefined") { ({ app } = remote); }

module.exports.main = tara => {
  tara.logger.debug("Loaded tara-right-click-menu.");
  return app.on("window-all-closed", () => {
    tara.logger.debug("Removing context menu dbs...");
    // Rm old stuff
    return rimraf.sync(TARA_CONFIG_DBS);
  });
};

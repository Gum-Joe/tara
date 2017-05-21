/**
 * @overview Registers protocols for tara (such as tara://)
 */
import { cyan, blue } from "chalk";
import { join, resolve, normalize } from "path";
import { app, protocol } from "electron"; // eslint-disable-line
import { TARA_CONFIG, CONFIG_FILE } from "../constants";
import Logger from "../logger";
import getPluginPath from "../utils/get-plugin-path";

// Config
const config = require(join(TARA_CONFIG, CONFIG_FILE));

const logger = new Logger({
  name: "protocol"
});

/**
 * Registers protocol tara://
 * @function registerTara
 * @returns {undefined} Nothing
 */
function registerTara() {
  logger.debug(`Registering file protocol ${cyan("tara://")}`);
  protocol.registerStandardSchemes(["tara"]);
  app.on("ready", () => {
    protocol.registerFileProtocol("tara", (req, callback) => {
      // Handle requests
      // Hande theme
      logger.debug("Got a request on protocol tara://");
      const url = req.url.substr(7);
      if (url === "theme/") {
        logger.debug("Theme requested.  Sending...");
        const pluginPath = getPluginPath(config.theme);
        // Get theme entry
        const pluginPkgJSON = require(join(pluginPath, "package.json"));
        const themeFile = join(pluginPath, pluginPkgJSON.tara.theme);
        logger.debug(`Using theme file ${blue(join(themeFile))}.`);
        callback({ path: normalize(themeFile) });
      }
    });
  }, (err) => {
    throw err;
  });
}

/**
 * Registers protocols
 * @function loadProtocols
 * @returns {undefined} Nothing
 */
export default () => {
  registerTara();
};

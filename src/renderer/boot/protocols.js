/**
 * @overview Registers protocols for tara (such as tara://)
 */
import { cyan, blue, red } from "chalk";
import fs from "fs";
import { join, resolve, normalize } from "path";
import { app, protocol } from "electron"; // eslint-disable-line
import sass from "node-sass";
const requireFoolWebpack = require("require-fool-webpack");
import { TARA_CONFIG, CONFIG_FILE } from "../../packages/tara-core/src/constants";
import Logger from "../../packages/tara-core/src/logger";
import getPluginPath from "../utils/get-plugin-path";

// Config
const config = requireFoolWebpack(join(TARA_CONFIG, CONFIG_FILE));

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
    protocol.registerBufferProtocol("tara", (req, callback) => {
      // Handle requests
      // TODO: Refactor into a router
      // Hande theme
      logger.debug("Got a request on protocol tara://");
      const url = req.url.substr(7);
      logger.debug(`Route: ${cyan(url)}`);
      if (url === "theme.scss/") {
        logger.debug("Theme requested.  Sending...");
        const pluginPath = getPluginPath(config.theme);
        // Get theme entry
        const pluginPkgJSON = requireFoolWebpack(join(pluginPath, "package.json"));
        const themeFile = join(pluginPath, pluginPkgJSON.tara.theme);
        logger.debug(`Using theme file ${blue(join(themeFile))}.`);
        // Compile
        sass.render({
          file: themeFile
        }, (err, result) => {
          logger.debug("Compiled theme to css.");
          if (err) {
            throw err;
          } else {
            callback({ data: result.css, mimeType: "text/css" });
          }
        });
      } else if (url.split("/")[0] === "plugin") {
        // Plugin requested
        const urlParts = url.split("/");
        const plugin = urlParts[1];
        if (urlParts[2] === "file") {
          // Handle file
          const fileURLArray = Array.concat(urlParts);
          // Nullifiy parts we don't need
          fileURLArray[0] = "";
          fileURLArray[1] = "";
          fileURLArray[2] = "";
          const fileURL = fileURLArray.join("/");
          // Get path to plugin
          const pluginPath = getPluginPath(urlParts[1]);
          const filePath = join(pluginPath, fileURL);
          logger.debug(`Sending file ${blue(filePath)}...`);
          // Read & send
          fs.readFile(filePath, (err, data) => {
            if (err) {
              throw err;
            } else {
              callback({ data });
            }
          });
        }
      } else {
        logger.err(`Route ${red(req.url)} not reconised!`);
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

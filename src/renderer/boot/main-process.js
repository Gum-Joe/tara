/**
 * @overview Starts main process tasks, both for tara and for plugins
 */
import { cyan } from "chalk";
import fs from "fs";
import electron from "electron"; // eslint-disable-line
import path from "path";
import addEventListeners from "./event-listeners";
import Logger from "../logger";

const logger = new Logger({
  name: "startup"
});

/**
 * Plugin init class
 * @class TaraPlugin
 * @param {Object} plugin Plugin that the class is bewing used for
 */
class TaraPlugin {
  constructor(plugin) {
    this.plugin = plugin;
    this.logger = new Logger({
      name: `plugin:${this.plugin.name}`
    });
    // Electron to use
    this.electron = electron;
  }
}

/**
 * Tara main process actions
 * @function mainProcess
 * @returns {undefined} Nothing
 */
export const mainProcessActions = () => {
  addEventListeners();
};

/**
 * Plugins' main process actions
 * @function startMainProcessPlugins
 * @param {Array} plugins Array of plugins to init
 * @param {String} location Absolute path to plugins location
 * @returns {undefined} Nothing
 */
export const startMainProcessPlugins = (plugins, location) => {
  logger.debug("Starting main process for plugins...");
  for (let plugin of plugins) {
    logger.debug(`Starting ${cyan(plugin.name)}...`);
    const taraPluginClass = new TaraPlugin(plugin);
    if (plugin.tara.hasOwnProperty("mainProcess")) {
      logger.debug("Using a custom script.");
      const main = require(path.join(location, plugin.name, plugin.tara.mainProcess));
      // Run
      main(taraPluginClass);
    } else {
      fs.access(plugin.main, (err) => {
        if (!err && require(path.join(location, plugin.name, plugin.main)).hasOwnProperty("main")) {
          const { main } = require(path.join(location, plugin.name, plugin.main));
          // Run
          main(taraPluginClass);
        } else {
          logger.debug(`Plugin ${cyan(plugin.name)} dosen't have an entry point.`);
        }
      });
    }
  }
};

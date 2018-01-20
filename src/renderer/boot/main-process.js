/**
 * @overview Starts main process tasks, both for tara and for plugins
 */
import { cyan } from "chalk";
import fs from "fs";
import electron from "electron"; // eslint-disable-line
import path from "path";
const requireFoolWebpack = require("require-fool-webpack");
import addEventListeners from "./event-listeners";
import Logger from "../logger.ts";
import TaraPlugin from "./plugin-init.ts";

const logger = new Logger({
  name: "startup"
});

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
    const taraPluginClass = new TaraPlugin(plugin, electron);
    if (plugin.tara.hasOwnProperty("mainProcess")) {
      logger.debug("Using a custom script.");
      const main = requireFoolWebpack(path.join(location, plugin.name, plugin.tara.mainProcess));
      // Run
      main(taraPluginClass);
    } else {
      fs.access(path.join(location, plugin.name, plugin.main), (err) => {
        if (!err && requireFoolWebpack(path.join(location, plugin.name, plugin.main)).hasOwnProperty("main")) {
          const { main } = requireFoolWebpack(path.join(location, plugin.name, plugin.main));
          // Run
          main(taraPluginClass);
        } else {
          logger.debug(`Plugin ${cyan(plugin.name)} dosen't have an entry point.`);
        }
      });
    }
  }
};

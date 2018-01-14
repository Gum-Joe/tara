/**
 * @overview Gets a plugins path
 */
import { yellow } from "chalk";
import { join, resolve, normalize } from "path";
import Logger from "../logger.ts";
import { PLUGIN_LOCATION, PLUGIN_CONFIG, PLUGIN_CORE_LOCATION, PLUGIN_CORE_CONFIG } from "../constants";

const logger = new Logger({
  name: "plugin:find"
});

 /**
  * Gets a plugin's path
  * @function getPluginPath
  * @param {String} plugin Plugin to look for
  * @returns {string} Path to plugin
  */
export default (plugin) => {
  // Check config
  const pluginsConfig = require(PLUGIN_CONFIG);
  const pluginsConfigCore = require(PLUGIN_CORE_CONFIG);
  if (pluginsConfig.dependencies.hasOwnProperty(plugin)) {
    logger.debug(`Plugin ${yellow(plugin)} is user installed`);
    return join(PLUGIN_LOCATION, plugin);
  } else if (pluginsConfigCore.dependencies.hasOwnProperty(plugin)) {
    logger.debug(`Plugin ${yellow(plugin)} is a core plugin.`);
    return join(PLUGIN_CORE_LOCATION, plugin);
  } else {
    throw new Error(`Plugin ${plugin} could not be found! Please check it is installed.`);
  }
};

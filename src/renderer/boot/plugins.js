/**
 * @overview File to load plugins
 */
import { join } from "path";
import { PLUGIN_CONFIG, PLUGIN_LOCATION } from "../constants";
// Plugin config file
const plugins = require(PLUGIN_CONFIG);

/**
 * @function loadPlugins
 * @constant
 * @type {Function}
 * @description Loads plugins
 * @returns {Array} Array of plugins
 */
export default () => {
  // Grab each pkg.json and send to store
  const pluginArray = [];
  for (let plugin in plugins.dependencies) {
    if (plugins.dependencies.hasOwnProperty(plugin)) {
      // Require
      const pluginJSON = require(join(PLUGIN_LOCATION, plugin, "package.json"));
      // ...and store
      pluginArray.push(pluginJSON);
    }
  }
  // Return
  return pluginArray;
};

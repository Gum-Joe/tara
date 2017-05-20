/**
 * @overview File to load plugins
 */
import { join } from "path";

/**
 * @function loadPlugins
 * @constant
 * @type {Function}
 * @description Loads plugins
 * @returns {Array} Array of plugins
 */
export default (config, location) => {
  // Plugin config file
  const plugins = require(config);

  // Grab each pkg.json and send to store
  const pluginArray = [];
  for (let plugin in plugins.dependencies) {
    if (plugins.dependencies.hasOwnProperty(plugin)) {
      // Require
      const pluginJSON = require(join(location, plugin, "package.json"));
      // ...and store
      pluginArray.push(pluginJSON);
    }
  }
  // Return
  return pluginArray;
};

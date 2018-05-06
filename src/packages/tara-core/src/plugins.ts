/**
 * @overview File to load plugins
 */
import { join } from "path";
const requireFoolWebpack = require("require-fool-webpack");

/**
 * Loads plugins based off the master package.json that contains the installed plugins
 * @param {String} config Location of config
 * @param {String} location location of plugins
 * @param {String} prop (optional) Prop to return in array
 * @returns {Array} Array of plugins
 */
export default (config, location, prop = null) => {
  // Plugin config file
  const plugins = requireFoolWebpack(config);

  // Grab each pkg.json and send to store
  const pluginArray = [];
  for (let plugin in plugins.dependencies) {
    if (plugins.dependencies.hasOwnProperty(plugin)) {
      // Require
      const pluginJSON = requireFoolWebpack(join(location, plugin, "package.json"));
      // ...and store
      if (!prop) {
        pluginArray.push(pluginJSON);
      } else {
        pluginArray.push(pluginJSON[prop]);
      }
    }
  }
  // Return
  return pluginArray;
};

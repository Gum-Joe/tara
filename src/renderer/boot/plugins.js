/**
 * @overview File to load plugins
 */
import { join } from "path";

/**
 * Loads plugins
 * @param {String} config Location of config
 * @param {String} location location of plugins
 * @param {String} prop (optional) Prop to return in array
 * @returns {Array} Array of plugins
 */
export default (config, location, prop = null) => {
  // Plugin config file
  const plugins = require(config);

  // Grab each pkg.json and send to store
  const pluginArray = [];
  for (let plugin in plugins.dependencies) {
    if (plugins.dependencies.hasOwnProperty(plugin)) {
      // Require
      const pluginJSON = require(join(location, plugin, "package.json"));
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

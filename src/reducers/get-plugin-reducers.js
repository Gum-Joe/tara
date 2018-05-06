/**
 * @overview File to get redux reducers from file
 */
import { join } from "path";
const requireFoolWebpack = require("require-fool-webpack");
import { PLUGIN_CONFIG, PLUGIN_LOCATION, PLUGIN_CORE_CONFIG, PLUGIN_CORE_LOCATION } from "../packages/tara-core/src/constants";
import { getPluginPath } from "../renderer/utils";
import getPlugins from "../packages/tara-core/src/plugins";

/**
 * Gets reducers from plugins, by looking for the export file,
 * either main.js/reducers
 * or reducers.js.  Reducer files should export an object of reducer (i.e. reducerName: reducer()), actions should be in api.actions
 * @returns {Promise} Reducers to use in combineReducers()
 * @function getReducers
 */
export default () => {
  // Get plugin list
  const plugins = [
    ...getPlugins(PLUGIN_CONFIG, PLUGIN_LOCATION),
    ...getPlugins(PLUGIN_CORE_CONFIG, PLUGIN_CORE_LOCATION)
  ];
  let reducersObj = {};
  for (let plugin of plugins) {
    const location = getPluginPath(plugin.name);
    const pkgJSON = requireFoolWebpack(join(location, "package.json"));
    // Check where to get reducer from
    if (pkgJSON.hasOwnProperty("tara") && pkgJSON.tara.hasOwnProperty("reducers") && pkgJSON.tara.type === "plugin") {
      // Rqeuire reducer file
      const reducers = requireFoolWebpack(join(location, pkgJSON.tara.reducers)).default;
      reducersObj = {
        ...reducersObj,
        ...reducers
      };
    } else if (pkgJSON.tara.type === "plugin") {
      // Require main file
      const { reducers } = requireFoolWebpack(join(location, pkgJSON.main));
      reducersObj = {
        ...reducersObj,
        ...reducers
      };
    }

    // If this is the last plugin, resolve
    if (plugins[plugins.length - 1] === plugin) {
      return reducersObj;
    }
  }
};

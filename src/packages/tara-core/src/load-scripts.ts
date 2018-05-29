/**
 * @overview Loads scripts for client side
 * to run some code on the main windows i.e. a right click menu
 */
import * as electron from "electron";
import { join } from "path";
import { PackageJSON } from "./interfaces";
import Tara from "./plugin-client";
import getPlugins from "./plugins";
import { PLUGIN_CONFIG, PLUGIN_CORE_CONFIG, PLUGIN_LOCATION, PLUGIN_CORE_LOCATION } from "./constants";
import Logger from "./logger";

const requireFoolWebpack = require("require-fool-webpack");
const logger = new Logger({
  name: "scripts",
  windowLogger: true,
})

/**
 * Handles plugin execution
 * @param {String} location Location where plugin is (PLUGIN_CORE, PLUGIN_CORE_LOCATION)
 * @param {PackageJSON} pluginJSON Plugin's package.json
 */
const handler: (location: string, pluginJSON: PackageJSON) => void = (location: string, pluginJSON: PackageJSON) => {
  if (pluginJSON.tara.type !== "plugin") {
    return;
  }

  let plugin;
  if (pluginJSON.tara.hasOwnProperty("script")) {
    plugin = requireFoolWebpack(join(location, pluginJSON.name, pluginJSON.tara.script));
  } else if (pluginJSON.tara.hasOwnProperty("mainProcess")) {
    plugin = requireFoolWebpack(join(location, pluginJSON.name, pluginJSON.tara.mainProcess));
  } else {
    plugin = requireFoolWebpack(join(location, pluginJSON.name, pluginJSON.main)).script;
  }
  if (typeof plugin !== "undefined") {
    plugin(new Tara(pluginJSON, electron, new Logger({
      name: `plugin:${pluginJSON.name}`,
      windowLogger: true,
    })));
  }
};

export default () => {
  logger.debug("Loading scripts for window...");
  logger.debug("Loading plugins...");
  const pluginsCore: PackageJSON[] = getPlugins(PLUGIN_CORE_CONFIG, PLUGIN_CORE_LOCATION);
  const plugins: PackageJSON[] = getPlugins(PLUGIN_CONFIG, PLUGIN_LOCATION);
  // Now load ALL scripts
  pluginsCore.forEach((plugin) => {
    handler(PLUGIN_CORE_LOCATION, plugin);
  });
  plugins.forEach((plugin) => {
    handler(PLUGIN_LOCATION, plugin);
  });
}
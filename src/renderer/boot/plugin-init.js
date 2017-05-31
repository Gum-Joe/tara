/**
 * @overview Plugin init class for plugin
 */
import { join } from "path";
import Logger from "../logger";
import getPlugins from "./plugins";
import { PLUGIN_LOCATION, PLUGIN_CORE_LOCATION, PLUGIN_CONFIG, PLUGIN_CORE_CONFIG } from "../constants";

/**
 * Plugin init class
 * @class TaraPlugin
 * @param {Object} plugin Plugin that the class is bewing used for
 * @param {Object} electron Electron
 * @param {Logger} logger (optional) Logger to use
 */
export default class TaraPlugin {
  constructor(plugin, electron, logger) {
    this.plugin = plugin;
    this.logger = logger || new Logger({
      name: `plugin:${this.plugin.name}`
    });
    // Electron to use
    this.electron = electron;
    // Bind static methods to this
    this.addEventListener = TaraPlugin.addEventListener.bind(this);
    this.send = TaraPlugin.send.bind(this);
    this.getPlugin = TaraPlugin.getPlugin.bind(this);
  }

  /**
   * Add an API method for other plugins to use (plugin only)
   * @param {String} name name of API
   * @param {Object} api API to add
   * @returns {undefined} Nothing
   */
  addApi(name = this.plugin.name, api) {
    TaraPlugin.addApi(name, api);
  }

  /**
   * Listen for an event
   * @param {String} module Module event to look for
   * @param {String} event Event to watch for
   * @param {Function} listener Listener for event
   * @returns {undefined} nothing
   * @static
   */
  static addEventListener(module, event, listener) {
    if (typeof window === "undefined") {
      const ipc = require("electron").ipcMain; // eslint-disable-line
      ipc.on(`${module}::${event}`, listener);
    } else {
      const ipc = require("electron").ipcRenderer; // eslint-disable-line
      ipc.on(`${module}::${event}`, listener);
    }
  }

  /**
   * Send an event
   * @param {String} module Module event to look for
   * @param {String} channel Channel to send on
   * @param {Symbol} data Data to send
   * @returns {undefined} Nothing
   * @static
   */
  static send(module, channel, data = "") {
    if (typeof window === "undefined") {
      const ipc = require("electron").ipcMain; // eslint-disable-line
      ipc.send(`${module}::${channel}`, data);
    } else {
      const ipc = require("electron").ipcRenderer; // eslint-disable-line
      ipc.send(`${module}::${channel}`, data);
    }
  }

  /**
   * Gets a plugin API method
   * @param {String} plugin Plugin to look for
   * @returns {Object} Plugin API
   * @static
   */
  static async getPlugin(plugin) {
    let location;
    // HACK: I know it is bad to repeat, but it has to be done here
    if (getPlugins(PLUGIN_CORE_CONFIG, PLUGIN_CORE_LOCATION, "name").includes(plugin)) {
      location = PLUGIN_CORE_LOCATION;

      // Load
      const pluginJSON = require(join(location, plugin, "package.json"));
      let pluginFile;
      if (pluginJSON.hasOwnProperty("tara") && pluginJSON.tara.hasOwnProperty("api")) {
        pluginFile = join(location, plugin, pluginJSON.tara.api);
        // Require it & return
        return await require(pluginFile);
      } else {
        pluginFile = join(location, plugin, pluginJSON.main);
        // Require it & return
        return await require(pluginFile).api;
      }
    } else if (getPlugins(PLUGIN_CONFIG, PLUGIN_LOCATION, "name").includes(plugin)) {
      location = PLUGIN_LOCATION;

      // Load
      const pluginJSON = require(join(location, plugin, "package.json"));
      let pluginFile;
      if (pluginJSON.hasOwnProperty("tara") && pluginJSON.tara.hasOwnProperty("api")) {
        pluginFile = join(location, plugin, pluginJSON.tara.api);
        // Require it & return
        return await require(pluginFile);
      } else {
        pluginFile = join(location, plugin, pluginJSON.main);
        // Require it & return
        return await require(pluginFile).api;
      }
    }
  }

  /**
   * Add an API method for other plugins to use (used by prototype.addApi)
   * @param {String} name name of API
   * @param {Object} api API to add
   * @returns {undefined} Nothing
   * @static
   */
  static addApi(name, api) {
    TaraPlugin.prototype[name] = api;
  }

}

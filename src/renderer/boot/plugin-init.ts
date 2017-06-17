/**
 * @overview Plugin init class for plugin
 */
import * as Electron from "electron";
import { join } from "path";
import Logger from "../logger";
import getPlugins from "./plugins";
import { TARA_CONFIG, CONFIG_FILE, PLUGIN_LOCATION, PLUGIN_CORE_LOCATION, PLUGIN_CONFIG, PLUGIN_CORE_CONFIG } from "../constants";
import Config from "../../shared/config";
import { PackageJSON } from "../interfaces";

/**
 * Plugin init class
 * @class TaraPlugin
 * @param {Object} plugin Plugin that the class is bewing used for
 * @param {Object} electron Electron
 * @param {Logger} logger (optional) Logger to use
 */
export default class TaraPlugin {

  public plugin: PackageJSON;
  public logger: Logger;
  public config: Config;
  public electron: Electron.AllElectron;
  public addEventListener: (module: string, event: string, listener: (event: Electron.EventEmitter, data: any) => void) => void;
  public send: (module: string, channel: string, data: any) => void;
  public getPlugin: (plugin: PackageJSON) => Promise<any>;
  public getPluginPath: (plugin: string, callback: (err: Error, path: string) => void) => void;
  public getPluginPathSync: (plugin: string) => string;

  constructor(plugin: PackageJSON, electron: Electron.AllElectron, logger: Logger) {
    this.plugin = plugin;
    this.logger = logger || new Logger({
      name: `plugin:${this.plugin.name}`,
    });
    this.config = new Config(join(TARA_CONFIG, CONFIG_FILE));
    // Electron to use
    this.electron = electron;
    // Bind static methods to this
    this.addEventListener = TaraPlugin.addEventListener.bind(this);
    this.send = TaraPlugin.send.bind(this);
    this.getPlugin = TaraPlugin.getPlugin.bind(this);
    this.getPluginPath = TaraPlugin.getPluginPath.bind(this);
    this.getPluginPathSync = TaraPlugin.getPluginPathSync.bind(this);
  }

  /**
   * Add an API method for other plugins to use (plugin only)
   * @param {String} name name of API
   * @param {Object} api API to add
   * @returns {undefined} Nothing
   * @public
   */
  public addApi(name = this.plugin.name, api) {
    TaraPlugin.addApi(name, api);
  }

  /**
   * Gets client API
   * @returns {Client} Client API
   * @public
   */
  public getClient() {
    const Client = require("./plugin-client.ts").default;
    return new Client(this.plugin, this.electron, this.logger);
  }

  /**
   * Listen for an event
   * @param {String} module Module event to look for
   * @param {String} event Event to watch for
   * @param {Function} listener Listener for event
   * @returns {undefined} nothing
   * @static
   * @public
   */
  public static addEventListener(module: string, event: string, listener: (event: Electron.EventEmitter, data: any) => void) {
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
  public static send(module: string, channel: string, data: any = "") {
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
   * @public
   */
  public static async getPlugin(plugin: string) {
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
   * Gets a plugin path
   * @param {String} plugin Plugin to get
   * @param {Function} callback Callback with args (err, path)
   * @returns {void} Nothing
   * @static
   * @public
   */
  public static getPluginPath(plugin: string, callback: (err: Error, path: string) => void) {
    if (getPlugins(PLUGIN_CORE_CONFIG, PLUGIN_CORE_LOCATION, "name").includes(plugin)) {
      callback(null, join(PLUGIN_CORE_LOCATION, plugin));
    } else if (getPlugins(PLUGIN_CONFIG, PLUGIN_LOCATION, "name").includes(plugin)) {
      callback(null, join(PLUGIN_LOCATION, plugin));
    } else {
      callback(new Error(`ENOENT: Could not find plugin ${plugin}.`), null);
    }
  }

  /**
   * Gets a plugin path (sync)
   * @param {String} plugin Plugin to get
   * @returns {String|Error} Path to plugin or error if not found
   * @static
   * @public
   */
  public static getPluginPathSync(plugin: string) {
    if (getPlugins(PLUGIN_CORE_CONFIG, PLUGIN_CORE_LOCATION, "name").includes(plugin)) {
      return join(PLUGIN_CORE_LOCATION, plugin);
    } else if (getPlugins(PLUGIN_CONFIG, PLUGIN_LOCATION, "name").includes(plugin)) {
      return join(PLUGIN_LOCATION, plugin);
    } else {
      return new Error(`ENOENT: Could not find plugin ${plugin}.`);
    }
  }

  /**
   * Add an API method for other plugins to use (used by prototype.addApi)
   * @param {String} name name of API
   * @param {Object} api API to add
   * @returns {undefined} Nothing
   * @static
   * @public
   */
  public static addApi(name: string, api: any) {
    TaraPlugin.prototype[name] = api;
  }

}

/**
 * @overview Generates layout for tara
 * @module layout
 */
import fs from "fs";
import { join } from "path";
import Logger from "../logger";
import { LAYOUT_LOCATION, LAYOUT_SETUP_DONE_LOCATION, PLUGIN_LOCATION, TYPE_PLUGIN } from "../constants";
// Location of layout files
const layout = require(LAYOUT_LOCATION);
const setupDB = require(LAYOUT_SETUP_DONE_LOCATION);

// Logger
const logger = new Logger({
  name: "layout"
});
/**
 * Class for Initialising layout
 * @class TaraLayout
 * @param options {Object} Options for layout maker
 */
class TaraLayoutClass {
  constructor(options) {
    // Setup logger & options
    this.logger = logger;
    this.options = options;
    this.config = options.config;
    this.parantConfig = options.parantConfig;
    // Defaults
    this.toSplit = options.toSplit || this.config;
  }

  /**
   * Selects a panel by name
   * @param panel {String} Name of panel to select
   * @function getPanelByName
   * @returns {Promise} Promise to take action on config
   */
  getPanelByName(panel) {
    this.logger.debug(`Getting panel ${panel} by name...`);
    // Get panel
    return new Promise((resolve, reject) => {
      try {
        if (this.config.hasOwnProperty("name") && this.config.name === panel) {
          return resolve(this);
          return this.config; // TODO: Promise here
        } else {
          // Loop to find
          this.toSplit = this._loop(this.config, "name", panel);
          return resolve(this);
        }
      } catch (e) {
        throw e;
      }
    });
  }

  /**
   * Loop throguh an object until it finds a prop matching a supplied value
   * @function _loop
   * @private
   * @param obj {Object} Object to loop through
   * @param prop {String} Prop to find
   * @param value {String} Value to look for
   * @returns {Object} Object contains property with matched value
   */
  _loop(obj, prop, value) {
    logger.debug(`Looping through an object for prop "${prop}" with value "${value}"`);
    for (let property in obj) {
      if (obj.hasOwnProperty(property) && typeof obj[property] === "object" && obj[property].hasOwnProperty(prop) && obj[property][prop] === value) {
        // Found it!
        return obj[property];
      } else if (obj.hasOwnProperty(property) && typeof obj[property] === "object") {
        // Loop through property
        // NOTE: Might cause a memeory leak
        return this._loop(obj[property], prop, value);
      }
    }
  }

  /**
   * Splits a panel
   * @param options {Object} Options
   * @function split
   * @returns {Promise} Promise to take action on config
   */
  split(options) {
    return new Promise((resolve, reject) => {
      try {
        logger.debug(`Splitting panel "${this.toSplit.name}" in direction ${options.direction}...`);
        // Move
        if (options.direction === "vertical") {
          if (options.moveTo === "left") {
            this.config = {
              vertical: {
                left: { contents: this.toSplit },
                right: {
                  contents: {}
                }
              }
            };
            this.select = this.config.vertical.right.contents;
            resolve(this);
          } else if (options.moveTo === "right") {
            this.config = {
              vertical: {
                right: { contents: this.toSplit },
                left: {
                  contents: {}
                }
              }
            };
            this.select = this.config.vertical.left.contents;
            resolve(this);
          } else {
            throw new TypeError("Wrong moveTo specified to panel splitter.  Possible: vertical, horizontal");
          }
        } else if (options.direction === "horizontal") {
          if (options.moveTo === "up") {
            this.config = {
              horizontal: {
                up: { contents: this.toSplit },
                down: {
                  contents: {}
                }
              }
            };
            this.select = this.config.horizontal.down.contents;
            resolve(this);
          } else if (options.moveTo === "down") {
            this.config = {
              horizontal: {
                down: { contents: this.toSplit },
                up: {
                  contents: {}
                }
              }
            };
            this.select = this.config.horizontal.up.contents;
            resolve(this);
          } else {
            throw new TypeError("Wrong moveTo specified to panel splitter.  Possible: up, down");
          }
        } else {
          throw new TypeError("Wrong direction specified to panel splitter.  Types: vertical, horizontal");
        }
      } catch (e) {
        throw e;
      }
    });
  }

  /**
   * Inserts module into layout
   * @function loadModule
   * @param moduleToLoad {String} Name of module to load
   */
  loadModule(moduleToLoad) {
    return new Promise((resolve, reject) => {
      this.select.module = moduleToLoad;
      this.select.name = moduleToLoad;
      resolve(this);
    });
  }

  /**
   * Updates setup database of plugins where layout has been made
   * @param plugin {String} Name of plugin
   * @static
   */
  static updateSetupDone(plugin) {
    // Update file
    // Now update
    setupDB.done.push(plugin);
    // Write
    const updatedDB = JSON.stringify(setupDB, null, "  ");
    // Write out
    fs.writeFile(LAYOUT_SETUP_DONE_LOCATION, updatedDB, (err) => {
      if (err) {
        throw err;
      } else {
        logger.debug("New layout plugin setup file written");
      }
    });
  }

  /**
   * Gets config
   * @param file {String} Absolute loctaion of layout config
   * @static
   */
  static getConfig(file) {
    // Requires file
    return require(LAYOUT_LOCATION);
  }

  /**
   * Updates config
   * @param config {Object} Config to update with
   * @static
   */
  static updateConfig(config) {
    // Make config
    const updatedConfig = JSON.stringify(config, null, "  ");
    // Write out
    fs.writeFile(LAYOUT_LOCATION, updatedConfig, (err) => {
      if (err) {
        throw err;
      } else {
        logger.debug("New layout written");
      }
    });
  }
}


/**
 * @function genLayout
 * @description Generates layout and stores it
 * @param plugins {Array} Array of plugins, from loadPlugins()
 */
export default async (plugins) => {
  logger.debug("Searching for plugins...");
  const pluginsToLayout = plugins.filter(plugin => plugin.tara.type === TYPE_PLUGIN && !setupDB.done.includes(plugin.name));
  logger.debug(`Plugins to setup: ${JSON.stringify(pluginsToLayout)}`);
  // Init layout class
  const TaraLayout = new TaraLayoutClass({
    updateConfig: true,
    configFile: LAYOUT_LOCATION,
    config: layout,
    parantConfig: layout
  });
  // Filter those we don't need
  // Now we loop
  for (let plugin of pluginsToLayout) {
    logger.debug(`Initialising plugin ${plugin.name}...`);
    // What file to use??
    if (plugin.tara.hasOwnProperty("init")) {
      logger.debug(`Using init script ${plugin.tara.init}...`);
      const init = require(join(PLUGIN_LOCATION, plugin.name, plugin.tara.init));
      // Run
      init(TaraLayout, (config) => {
        // Update config
        TaraLayoutClass.updateConfig(config);
        // Add to index
        TaraLayoutClass.updateSetupDone(plugin.name);
      });
    } else {
      // Use entry
      logger.debug(`Using entry file ${plugin.main}...`);
      const { init } = require(join(PLUGIN_LOCATION, plugin.name, plugin.main));
      // Run
      init(TaraLayout, (config) => {
        // Update config
        TaraLayoutClass.updateConfig(config);
        // Add to index
        TaraLayoutClass.updateSetupDone(plugin.name);
      });
    }
  }
};

/**
 * @overview Generates layout for tara
 * @module layout
 */
import { eachSeries } from "async";
import fs from "fs";
import { join } from "path";
import Logger from "../logger";
import { LAYOUT_LOCATION, LAYOUT_SETUP_DONE_LOCATION, PLUGIN_LOCATION, TYPE_PLUGIN } from "../constants";
// Location of layout files
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
    // Other stuff
    this._loop_props = [];
    // Setup this.config methods
    /**
     * Sets a prop using an array
     * @param props {Array} List of objects to go through by depth
     * @param val {Symbol} Value to set
     */
    this.config.setPropByArray = (props, val) => {
      // Get prop
      if (props.length !== 0) {
        // Only do if props to loop by
        let propstring = "";
        props.map(prop => propstring += prop + ".");
        // Fix issue where . is left over
        propstring = propstring.slice(0, propstring.length - 1);
        // now eval
        eval(`this.config.${propstring} = val`);
      } else {
        this.config = val;
      }
    };
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
          if (this.toSplit.hasOwnProperty("contents")) {
            this.toSplit = this.toSplit.contents;
          }
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
      this._loop_props.push(property);
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
            this.toSplit = {
              vertical: {
                left: { ...this.toSplit, contents: this.toSplit.contents || this.toSplit },
                right: {
                  contents: {}
                }
              }
            };
            this.select = this.toSplit.vertical.right;
            resolve(this);
          } else if (options.moveTo === "right") {
            this.toSplit = {
              vertical: {
                right: { ...this.toSplit, contents: this.toSplit.contents || this.toSplit },
                left: {
                  contents: {}
                }
              }
            };
            this.select = this.toSplit.vertical.left;
            resolve(this);
          } else {
            throw new TypeError("Wrong moveTo specified to panel splitter.  Possible: vertical, horizontal");
          }
        } else if (options.direction === "horizontal") {
          if (options.moveTo === "up") {
            this.toSplit = {
              horizontal: {
                up: { ...this.toSplit, contents: this.toSplit.contents || this.toSplit },
                down: {
                  contents: {}
                }
              }
            };
            this.select = this.toSplit.horizontal.down;
            resolve(this);
          } else if (options.moveTo === "down") {
            this.toSplit = {
              horizontal: {
                down: { ...this.toSplit, contents: this.toSplit.contents || this.toSplit },
                up: {
                  contents: {}
                }
              }
            };
            this.select = this.toSplit.horizontal.up;
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
      this.select.contents.module = moduleToLoad;
      this.select.name = moduleToLoad;
      resolve(this);
    });
  }

  /**
   * Sets a prop of a panel
   * @param props {Object} Props and values to add
   * @returns {Promise}
   * @function set
   * @todo Does not work yet
   */
  set(props) {
    return new Promise((resolve, reject) => {
      this.select = { ...this.select, ...props };
      resolve(this);
    });
  }

  /**
   * Sets the width of the selected panel
   * @param width {Number} Width to set
   * @function width
   */
  width(width) {
    return new Promise((resolve, reject) => {
      this.select.width = width;
      resolve(this);
    });
  }

  /**
   * Sets the height of the selected panel
   * @param height {Number} Height to set
   * @function width
   */
  height(height) {
    return new Promise((resolve, reject) => {
      this.select.height = height;
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
  static updateConfig(config, callback) {
    // Make config
    const updatedConfig = JSON.stringify(config, null, "  ");
    // Write out
    fs.writeFile(LAYOUT_LOCATION, updatedConfig, (err) => {
      if (err) {
        throw err;
      } else {
        logger.debug("New layout written");
        callback();
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
  const pluginsToLayout = plugins.filter(plugin => (plugin.tara.type === TYPE_PLUGIN && !setupDB.done.includes(plugin.name)) || process.argv.includes("--regen-layout"));
  logger.debug(`Plugins to setup: ${JSON.stringify(pluginsToLayout)}`);
  // Filter those we don't need
  // Now we loop
  eachSeries(pluginsToLayout, (plugin, callback) => {
    logger.debug(`Initialising plugin ${plugin.name}...`);
    // Init layout class
    // We have to re-require config each time
    // or the layout will not update for each plugin
    const layout = JSON.parse(fs.readFileSync(LAYOUT_LOCATION).toString("utf8"));
    const TaraLayout = new TaraLayoutClass({
      updateConfig: true,
      configFile: LAYOUT_LOCATION,
      config: layout,
      parantConfig: layout
    });
    // What file to use??
    if (plugin.tara.hasOwnProperty("init")) {
      logger.debug(`Using init script ${plugin.tara.init}...`);
      const init = require(join(PLUGIN_LOCATION, plugin.name, plugin.tara.init));
      // Run
      init(TaraLayout, (tara) => {
        // Update config
        TaraLayoutClass.updateConfig(tara.config);
        // Add to index
        TaraLayoutClass.updateSetupDone(plugin.name);
      });
    } else {
      // Use entry
      logger.debug(`Using entry file ${plugin.main}...`);
      const { init } = require(join(PLUGIN_LOCATION, plugin.name, plugin.main));
      // Run
      init(TaraLayout, async (tara) => {
        // Use JS's mutable objects
        // To link looped object
        // To this.toSplit
        await tara.config.setPropByArray(tara._loop_props, tara.toSplit);
        // Update config
        TaraLayoutClass.updateConfig(tara.config, callback);
        // Add to index
        TaraLayoutClass.updateSetupDone(plugin.name);
        //callback();
      });
    }
  });
};

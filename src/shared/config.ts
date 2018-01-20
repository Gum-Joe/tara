/**
 * @overview Config class
 */
import { writeFile } from "fs";
import { Config } from "../renderer/interfaces";
import Logger from "../renderer/logger";
const requireFoolWebpack = require("require-fool-webpack");

/**
 * Config class
 * @class ConfigClass
 * @param {String} configFile Absolute path to config File
 */
export default class ConfigClass {
  // Properties
  private configFile: string;
  private logger: Logger;
  // Public ones
  public config: Config;

  constructor(configFile: string) {
    this.configFile = configFile;
    this.logger = new Logger({
      name: "config",
    });
    this._getConfig();
  }

  /**
   * Gets the config
   * @returns {void} Nothing
   * @private
   */
  private _getConfig() {
    this.config = requireFoolWebpack(this.configFile);
  }

  /**
   * Updates config
   * @returns {void} Nothing
   */
  public update() {
    this.logger.debug("Updating config...");
    const JSONString: string = JSON.stringify(this.config, null, "  ");
    // Write
    writeFile(this.configFile, JSONString, (err) => {
      if (err) {
        throw err;
      }
      this.logger.debug("Config file successfully updated.");
    });
  }
}

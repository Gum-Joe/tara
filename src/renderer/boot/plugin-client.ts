/**
 * @overview Client API for tara
 */
import chalk from "chalk";
import { PackageJSON } from "../interfaces";
import TaraPlugin from "./plugin-init";
import Logger from "../logger";

const cyan = chalk.cyan;

/**
 * Client API class
 * @extends TaraPlugin
 * @class
 */
export default class Client extends TaraPlugin {

  public logger: Logger;

  /**
   * Loads a script on the windows
   * @param {String} script Absolute path to script to load
   */
  public loadScript(script: string) {
    if (!this.config.config.window.scripts.includes(script)) {
      this.logger.debug(`Loading script ${cyan(script)}...`);
      this.config.config.window.scripts.push(script);
      this.config.update();
    }
  }
}

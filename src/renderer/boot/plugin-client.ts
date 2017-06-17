/**
 * @overview Client API for tara
 */
import * as Electron from "electron";
import { cyan } from "chalk";
import { PackageJSON } from "../interfaces";
import TaraPlugin from "./plugin-init";
import Logger from "../logger";

/**
 * Client API class
 * @extends TaraPlugin
 * @class
 */
export default class Client extends TaraPlugin {

  public logger: Logger;

  constructor(plugin: PackageJSON, electron: Electron.AllElectron, logger: Logger) {
    super(plugin, electron, logger);
    this.logger = new Logger({
      name: `plugin:${this.plugin.name}`,
    });
  }
  /**
   * Loads a script on the windows
   * @param {String} script Script to load
   */
  public loadScript(path: string) {
    this.logger.debug(`Loading script ${cyan(path)}...`);
  }
}

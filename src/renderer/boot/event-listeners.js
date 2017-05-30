/**
 * @overview Listens for events for tara
 */
import { cyan, yellow } from "chalk";
import electron from "electron"; // eslint-disable-line
import * as listeners from "./ipc";
import Logger from "../logger";
import TaraPlugin from "./plugin-init";

const logger = new Logger({
  name: "ipc"
});

/**
 * Adds event listeners
 * @function addEventListeners
 * @returns {undefined} Nothing
 */
export default () => {
  logger.debug("Adding event listeners...");
  logger.debug("Creating array...");
  let arrayOfListeners = [];
  for (let listenerParent in listeners) {
    // Loop through a module of listeners
    for (let listener in listeners[listenerParent]) {
      if (listeners[listenerParent].hasOwnProperty(listener)) {
        // ... and execute it
        logger.debug(`Starting listener ${yellow(listener)} from ${cyan(listenerParent)}...`);
        const tara = new TaraPlugin({
          name: "ipc"
        }, electron, logger);
        listeners[listenerParent][listener](tara);
      }
    }
  }
};

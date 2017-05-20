/**
 * @overview Listens for events for tara
 */
import { cyan, yellow } from "chalk";
import { ipcMain as ipc } from "electron"; // eslint-disable-line
import Logger from "../logger";

const logger = new Logger({
  name: "ipc"
});

/**
 * Adds event listerners
 * @function addEventListeners
 * @returns {undefined} Nothing
 */
export default () => {
  logger.debug("Nothing to do here.");
};

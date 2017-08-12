/**
 * @overview Entry file for operation paste
 * @module tara-file-operations/paste
 */
import * as electron from "electron";
import Tara from "../../../../renderer/boot/plugin-client";
import Logger from "../../../../renderer/logger";
import pkgJSON from "../../package.json";
import { FILE_OPT_OPEN_WINDOW } from "../constants";

module.exports = () => {
  const logger = new Logger({
    name: "paste",
  });
  const tara = new Tara(pkgJSON, electron, logger);
  // Handle pasteing
  // Load window
  electron.ipcRenderer.send(FILE_OPT_OPEN_WINDOW, {});
};

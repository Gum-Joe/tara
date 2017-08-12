/**
 * @overview File for operation <operation>
 * @module tara-file-operations
 */
import * as electron from "electron";
import * as jquery from "jquery";
import * as mkdirp from "mkdirp";
import * as DB from "nedb";
import { join } from "path";
import Logger from "../../../renderer/logger";
import Tara from "../../../renderer/boot/plugin-client";
import { TARA_CONFIG_DBS } from "../../../renderer/constants";
import pkgJSON from "../package.json";

// Logger
const logger = new Logger({
  name: "copy",
});

module.exports = () => {
  // Start by making a tara object to use
  logger.debug("Copying files...");
  logger.debug("Creating tara object...");
  const tara: Tara = new Tara(pkgJSON, electron, logger);
  // Open copy db & add files
  mkdirp.sync(join(TARA_CONFIG_DBS, "file-operations"));
  // Get files
  const filesID: string[] = global.store.getState().selectedFiles;
  const files: string[] = [];
  for (let id of filesID) {
    // Get file names
    if (typeof id !== "undefined") {
      const doc: string = document.getElementById(id).attributes["data-file"].nodeValue;
      files.push(doc);
    }
  }
  const db = new DB({ filename: join(TARA_CONFIG_DBS, "file-operations", "tmp.db"), autoload: true });
  db.remove({}, { multi: true }, (err, numRemoved) => {
    // Clear db
    if (err) {
      throw err;
    }
    tara.logger.debug(`Cleared db (numRemoved: ${numRemoved})`);
  });
  db.insert({ action: "copy", files, timeAdded: Date.now() }, (err, docs) => {
    if (err) {
      throw err;
    }
    tara.logger.debug("File inserted into db.");
    tara.logger.debug(`Files: ${files.join(", ")}`);
    // load_windows(tara);
  });
};

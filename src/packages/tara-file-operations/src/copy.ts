/**
 * @overview File for operation <operation>
 * @module tara-file-operations
 */
import * as electron from "electron";
import * as mkdirp from "mkdirp";
import * as DB from "nedb";
import { join } from "path";
import Logger from "../../../renderer/logger";
import Tara from "../../../renderer/boot/plugin-client";
import pkgJSON from "../package.json";
import { TARA_CONFIG_DBS } from "../../../renderer/constants";

// Logger
const logger = new Logger({
  name: "copy",
});

module.exports = () => {
  // Start by making a tara object to use
  logger.debug("Copying files...");
  logger.debug("Creating tara object...");
  const tara = new Tara(pkgJSON, electron, logger);
  // Open copy db & add files
  mkdirp.sync(join(TARA_CONFIG_DBS, "file-operations"));
  const db =  new DB(join(TARA_CONFIG_DBS, "file-operations", "tmp.db"));
  db.insert({ action: "copy", from: "", to: "" }, (err, files) => {
    if (err) {
      throw err;
    }
    tara.logger.debug("File inserted into db.  Launching copy window...");
    tara.logger.debug(`File: ${files}`);
    // load_windows(tara);
  });
};

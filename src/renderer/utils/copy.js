/**
 * @overview Copy util for tara
 * @module utils
 */
import fs from "fs";

/**
 * Copy a file
 * @param from {String} Absolute path to source
 * @param to {String} Absolute path to destination
 * @function copy
 */
export default (from, to) => {
  fs.createReadStream(from)
    .pipe(fs.createWriteStream(to));
};

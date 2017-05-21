/**
 * @overview Copy util for tara
 * @module utils
 */
const fs = require("fs");

/**
 * Copy a file
 * @param {String} from Absolute path to source
 * @param {String} to Absolute path to destination
 * @function copy
 * @returns {undefined} Nothing
 */
module.exports = {};
module.exports.default = (from, to) => {
  return new Promise((resolve, reject) => {
    // Copy
    const read = fs.createReadStream(from); // Create read stream
    const write = fs.createWriteStream(to); // Create write stream
    const handleError = (err) => {
      read.destroy();
      write.end();
      reject(err);
    };
    read.on("error", handleError); // Handle error
    write.on("error", handleError); // Handle error
    write.on("finish", () => resolve()); // What to do when done
    read.pipe(write); // Run copy
  });
};

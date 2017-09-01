/**
 * @overview Gets a list of file in specific dirs
 * @module tara-file-operations
 */
import { eachSeries } from "async";
import * as Electron from "electron";
import * as fs from "fs";
import { join, parse } from "path";
import Tara from "../../../renderer/boot/plugin-init";
import Logger from "../../../renderer/logger";
import { FILE_OPS_SEND_FILE_LIST_ITEM, FileToFrom } from "./constants";

const logger = new Logger({
  name: "tara-file-ops-lister",
});
/**
 * Gets files list & file sizes
 * @param {EventEmitter} event IPC EventEmitter
 * @param {Array<String>} files Array of files to copy
 * @param {String} dest Path to destination
 * @param {String} append [OPTIONAL] What to put between destination dir & file names (useful for sub-dir copying)
 * @param {Function} callback callback
 * @returns {Array<Object>} Array of object { to: x, from: y } in callback
 */
export default function getFiles(event: Electron.Event, files: string[], dest: string, append: string = "", callback: (filesArray: Array, totalSizeBytes: number) => void) {
  logger.debug("Generating list of files...");
  logger.debug(`Files: ${files}`);
  let filesArray: FileToFrom[] = [];
  let totalSizeBytes: number = 0;
  // Check what to do
  eachSeries(files, (file, cb) => {
    // Get just the filename
    const fileName = parse(file).base;
    // Is it a file?
    fs.stat(file, (err, stat) => {
      if (err) {
        logger.err("ERROR creating file list!");
        logger.throw_noexit(err);
      } else {
        if (stat.isDirectory()) {
          // Re run for this dir & append
          filesArray.push({ mkdir: join(dest, append, fileName) });
          logger.debug(`mkdir ${join(dest, append, fileName)}`);
          fs.readdir(file, (error, filesInFolder) => {
            if (error) {
              throw err;
            } else {
              // Map origin paths
              filesInFolder = filesInFolder.map(f => join(file, f));
              // Re-run file indexer,
              // Using files list from fs.readdir() as input,
              // joined with parent dir
              // Destiation: original destination + append + parent dir
              // Append is parent dir
              getFiles(event, filesInFolder, join(dest, fileName), "", (filesList, totalSubSize) => {
                filesArray = Array.concat(filesArray, filesList);
                totalSizeBytes += totalSubSize;
                cb();
              });
            }
          });
        } else {
          // File, take name and add to dest (process.cwd())
          fs.stat(file, (error, stats) => {
            if (error) {
              throw error;
            } else {
              filesArray.push({ from: file, to: join(dest, append, fileName), size: stats.size });
              totalSizeBytes += stats.size;
              logger.debug(`${file} -> ${join(dest, append, fileName)}`);
              cb();
            }
          });
        }
      }
    });
  }, () => {
    logger.debug(`Size of files: ${totalSizeBytes}`);
    callback(filesArray, totalSizeBytes);
  });
}

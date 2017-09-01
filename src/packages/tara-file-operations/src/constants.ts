/**
 * @overview Constants for file operations
 * @module tara-file-operations
 */

export const FILE_OPT_OPEN_WINDOW = "FILE_OPT_OPEN_WINDOW";
export const FILE_OPS_GET_FILES = "FILE_OPS_GET_FILES";
export const FILE_OPS_SEND_FILE_LIST_ITEM = "FILE_OPS_SEND_FILE_LIST_ITEM";

/**
 * Files index interface
 * @param {String} to Source file
 * @param {String} from Destination file
 * @param {String} mkdir [OPTIONAL] Makes a dir
 * @interface FileToFrom
 */
export interface FileToFrom {
  to?: string;
  from?: string;
  mkdir?: string;
  size?: number;
}

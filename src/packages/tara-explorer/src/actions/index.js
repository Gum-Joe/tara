/**
 * @overview Index of actions
 */
import { TARA_UPDATE_DIR, TARA_DIR_BACK, TARA_DIR_FORWARD, EXPLORER_SELECT_FILE, EXPLORER_DESELECT_FILE } from "../constants";

/**
 * Updates dir
 * @param {String} dir Dir to update to
 * @returns {Object} Action for reducer
 */
export const updateDir = (dir) => {
  return {
    type: TARA_UPDATE_DIR,
    dir
  };
};

/**
 * Selects a file
 * @param {String} file to select
 * @returns {Object} Action for reducer
 */
export const selectFile = (file) => {
  return {
    type: EXPLORER_SELECT_FILE,
    file
  };
};

/**
 * Deselects a file
 * @param {String} file to deselect
 * @returns {Object} Action for reducer
 */
export const deselectFile = (file) => {
  return {
    type: EXPLORER_DESELECT_FILE,
    file
  };
};

/**
 * Goes one dir forward
 * @returns {Object} Action for reducer
 */
export const forwardDir = () => {
  return {
    type: TARA_DIR_FORWARD,
  };
};

/**
 * Goes one dir back
 * @returns {Object} Action for reducer
 */
export const backDir = () => {
  return {
    type: TARA_DIR_BACK,
  };
};

// Put them all together and export
export default {
  updateDir,
  selectFile,
  deselectFile,
  forwardDir,
  backDir
};

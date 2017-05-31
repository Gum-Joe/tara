/**
 * @overview Index of actions
 */
import { TARA_UPDATE_DIR } from "../constants";

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

// Put them all together and export
export default {
  updateDir
};

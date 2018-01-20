/**
 * @overview Dir reducer.  Stores dir as dir: {string}
 */
import { TARA_UPDATE_DIR } from "../constants";
import { dir as defaultState } from "./defaults";

/**
 * Dir reducer.
 * Actions:
 *  TARA_UPDATE_DIR: Updates dir (like chdir)
 * Action format:
 *  {
 *    type: {string} action type (listed above)
 *    dir: {string} new dir
 *  }
 * @param {Object} state Redux state
 * @param {Object} action Action object
 */

export default (state = defaultState, action) => {
  switch (action.type) {
  case TARA_UPDATE_DIR:
    return {
      ...state,
      dir: action.dir
    };
    break;
  default:
    return state;
  }
};

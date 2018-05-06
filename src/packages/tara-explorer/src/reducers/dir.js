/**
 * @overview Dir reducer.  Stores dir as dir: {string}
 */
import ReduxUndo from "redux-undo";
import { TARA_UPDATE_DIR, TARA_DIR_BACK, TARA_DIR_FORWARD } from "../constants";
import { dir as defaultState } from "./defaults";
import undoable from "redux-undo";

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

const reducer = (state = defaultState, action) => {
  switch (action.type) {
  case TARA_UPDATE_DIR:
    return {
      ...state,
      dir: action.dir,
    };
    break;
  default:
    return state;
  }
};

export default undoable(reducer);
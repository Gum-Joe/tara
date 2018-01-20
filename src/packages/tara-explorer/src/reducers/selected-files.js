/**
 * @overview Reducer for selected files
 */
import { selectedFiles as defaultState } from "./defaults";
import { EXPLORER_SELECT_FILE, EXPLORER_DESELECT_FILE } from "../constants";

 /**
  * Selected files reducer.
  * Actions:
  *  EXPLORER_SELECT_FILE: Adds a selected file
  *  EXPLORER_DESELECT_FILE: Removes a file
  * Action format:
  *  {
  *    type: {string} action type (listed above)
  *    file: {string} new dir
  *  }
  * @param {Array} state Redux state
  * @param {Object} action Action object
  */

 export default (state = defaultState, action) => {
   switch (action.type) {
   case EXPLORER_SELECT_FILE:
     if (!state.includes(action.file)) {
       return [
         ...state,
         action.file
       ];
     } else {
       return state;
     }
     break;
  case EXPLORER_DESELECT_FILE:
    const newState = Array.concat([], state);
    const index = newState.findIndex((file) => file === action.file);
    delete newState[index];
    return newState;
    break;
   default:
     return state;
   }
 };

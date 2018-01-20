/**
 * @overview Index of reducers & redux store maker
 */
import { routerReducer } from "react-router-redux";
import { combineReducers } from "redux";
import dir from "./dir";
import selectedFiles from "./selected-files";

// Export
export default {
  dir,
  selectedFiles,
  routing: routerReducer,
};

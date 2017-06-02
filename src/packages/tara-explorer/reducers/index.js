/**
 * @overview Index of reducers & redux store maker
 */
import { routerReducer } from "react-router-redux";
import { combineReducers } from "redux";
import dir from "./dir";

// Export
export default {
  dir,
  routing: routerReducer
};

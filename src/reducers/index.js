/**
 * @overview Reducer index
 * Combines reducers and exports
 */
import { combineReducers } from "redux";
import layout from "./layout";

const rootReducer = combineReducers({
  layout
});

export default rootReducer;

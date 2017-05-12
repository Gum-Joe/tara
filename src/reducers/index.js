/**
 * @overview Reducer index
 * Combines reducers and exports
 */
import { combineReducers } from "redux";
import layout from "./layout";
import plugins from "./plugins";

const rootReducer = combineReducers({
  layout,
  plugins
});

export default rootReducer;

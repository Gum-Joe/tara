/**
 * @overview Stores plugins for tara
 */
import { plugins as defaultState } from "./defaults";
import { ADD_PLUGIN, REMOVE_PLUGIN } from "../actions";

export default (state = defaultState, action) => {
  switch (action.type) {
    case ADD_PLUGIN:
      // Add the plugin
      return [...state, action.plugin];
    case REMOVE_PLUGIN:
      return state.filter(plugin => plugin.name === action.plugin.name);
    default:
      return state;
  }
};

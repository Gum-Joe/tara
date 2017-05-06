/**
 * @overview Stores layout for tara
 */
import { layout as defaultState } from "./defaults";
import { UPDATE_LAYOUT_CONFIG, UPDATE_LAYOUT_RENDER } from "../actions";

export default (state = defaultState, action) => {
  switch (action.type) {
    case UPDATE_LAYOUT_CONFIG:
      // Should update file here
      return Object.assign({}, { config: action.config, rendered: state.rendered });
    case UPDATE_LAYOUT_RENDER:
      return Object.assign({}, { config: state.config, rendered: action.render });
    default:
      return state;
  }
};

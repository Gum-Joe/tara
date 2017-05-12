/**
 * @overview Action store for redux reducers
 */
// Constants
// Layout
export const CREATE_LAYOUT_RENDER = "CREATE_LAYOUT_RENDER";
export const UPDATE_LAYOUT_CONFIG = "UPDATE_LAYOUT_CONFIG";
export const UPDATE_LAYOUT_RENDER = "UPDATE_LAYOUT_RENDER";

// Plugins
export const ADD_PLUGIN = "ADD_PLUGIN";
export const REMOVE_PLUGIN = "REMOVE_PLUGIN";

// Actions
// Creaye rendered layout
export const createLayoutRender = (config) => {
  return {
    type: CREATE_LAYOUT_RENDER,
    config
  };
};

// Update layout config
export const updateLayoutConfig = (config) => {
  return {
    type: UPDATE_LAYOUT_CONFIG,
    config
  };
};

// Update layout render
export const updateLayoutRender = (render) => {
  return {
    type: UPDATE_LAYOUT_RENDER,
    render
  };
};

/**
 * Adds a plugin
 * @param plugin {Object} Plugin's package.json
 */
export const addPlugin = (plugin) => {
  return {
    type: ADD_PLUGIN,
    plugin
  };
};

/**
 * Removes a plugin
 * @param plugin {Object} Plugin's package.json
 */
export const removePlugin = (plugin) => {
  return {
    type: REMOVE_PLUGIN,
    plugin
  };
};

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

// Theme
export const UPDATE_THEME = "UPDATE_THEME";
export const FETCH_THEME = "FETCH_THEME";

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
 * @param {Object} plugin Plugin's package.json
 * @returns {void}
 */
export const addPlugin = (plugin) => {
  return {
    type: ADD_PLUGIN,
    plugin
  };
};

/**
 * Removes a plugin
 * @param {Object} plugin Plugin's package.json
 * @returns {void}
 */
export const removePlugin = (plugin) => {
  return {
    type: REMOVE_PLUGIN,
    plugin
  };
};

/**
 * Update the theme
 * @param {String} theme Theme css
 * @returns {void}
 */
export const updateTheme = (theme) => {
  return {
    type: UPDATE_THEME,
    theme
  };
};
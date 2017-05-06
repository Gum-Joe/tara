/**
 * @overview Action store for redux reducers
 */
// Constants
export const CREATE_LAYOUT_RENDER = "CREATE_LAYOUT_RENDER";
export const UPDATE_LAYOUT_CONFIG = "UPDATE_LAYOUT_CONFIG";
export const UPDATE_LAYOUT_RENDER = "UPDATE_LAYOUT_RENDER";

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

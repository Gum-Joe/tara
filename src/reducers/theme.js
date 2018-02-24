/**
 * @overview File to store reducer for theme
 */
import { theme as defaultState } from "./defaults";
import { FETCH_THEME, UPDATE_THEME } from "../actions";
import ThemeHeader from "../components/theme-style-head";

export default (state = defaultState, action) => {
    switch (action.type) {
        case UPDATE_THEME:
            // Update theme CSS
            return {
                ...state,
                css: action.theme.css,
                html: action.theme.html
            };
        default: return state;
    }
};
// Constants
import path from "path";

export const DEFAULT_WIDTH = 1280;
export const DEFAULT_HEIGHT = 720;
export const DEV_ENV = "development";
export const TARA_CONFIG = "../config"; // Should be $HOME/.tara
export const PLUGIN_LOCATION = path.resolve(__dirname, path.join(TARA_CONFIG, "plugins"));
export const PLUGIN_CONFIG = path.resolve(__dirname, path.join(PLUGIN_LOCATION, "package.json"));
export const TYPE_PLUGIN = "plugin";
export const LAYOUT_LOCATION = path.resolve(__dirname, path.join(TARA_CONFIG, "layout.json"));
export const LAYOUT_LOCATION_DEFAULT = path.resolve(__dirname, path.join(TARA_CONFIG, "layout-default.json"));
export const LAYOUT_SETUP_DONE_LOCATION = path.resolve(__dirname, path.join(TARA_CONFIG, "layout-setup.json"));
export const REGEN_LAYOUT_ARGS = "--regen-layout";

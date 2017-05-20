// Constants
import path from "path";

// Windows settings
export const DEFAULT_WIDTH = 1280;
export const DEFAULT_HEIGHT = 720;
// Env & type strings
export const DEV_ENV = "development";
export const TYPE_PLUGIN = "plugin";
// File locations
export const TARA_CONFIG = "../config"; // Should be $HOME/.tara
export const TARA_PACKAGES = "../packages";
export const PLUGIN_LOCATION = path.resolve(__dirname, path.join(TARA_CONFIG, "plugins"));
export const PLUGIN_CONFIG = path.resolve(__dirname, path.join(PLUGIN_LOCATION, "package.json"));
export const PLUGIN_CORE_LOCATION = path.resolve(__dirname, TARA_PACKAGES);
export const PLUGIN_CORE_CONFIG = path.resolve(__dirname, path.join(PLUGIN_CORE_LOCATION, "package.json"));
export const LAYOUT_LOCATION = path.resolve(__dirname, path.join(TARA_CONFIG, "layout.json"));
export const LAYOUT_LOCATION_DEFAULT = path.resolve(__dirname, path.join(TARA_CONFIG, "layout-default.json"));
export const LAYOUT_SETUP_DONE_LOCATION = path.resolve(__dirname, path.join(TARA_CONFIG, "layout-setup.json"));
// CLI args
export const REGEN_LAYOUT_ARGS = "--regen-layout";
// IPC stuff
export const GET_PLUGIN_CLIENT = "GET_PLUGIN_CLIENT";
export const SEND_PLUGIN_CLIENT = "SEND_PLUGIN_CLIENT";

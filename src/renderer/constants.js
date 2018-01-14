// Constants
import path from "path";

// Windows settings
export const DEFAULT_WIDTH = 1280;
export const DEFAULT_HEIGHT = 720;
// Env & type strings
export const DEV_ENV = "development";
export const TYPE_PLUGIN = "plugin";
// File locations
export const TARA_CONFIG = path.resolve(__dirname, "../config"); // Should be $HOME/.tara
export const TARA_CONFIG_DBS = path.join(TARA_CONFIG, "db");
export const TARA_TMP_DB = path.join(TARA_CONFIG_DBS, "tara", "tmp");
export const CONFIG_FILE = "config.json";
export const TARA_PACKAGES = path.resolve(__dirname, "../packages");
export const THEME_FILE = path.resolve(__dirname, "../css/get-theme.scss");
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
export const IPC_GET_PLUGINS = "IPC_GET_PLUGINS";
export const IPC_SEND_PLUGINS = "IPC_SEND_PLUGINS";
// Theme stuff
export const THEME_FILE_CONTENTS_DEFAULT = `// Theme file for tara
// Contains theme name & import for theme file
// DO NOT EDIT
$theme:`;

// Logger
export const WINDOW_TYPE = "WINDOW";
export const WINDOW_SENT_TYPE = "WINDOW_SENT";
export const PROCESS_TYPE = "PROCESS";
export const LOGGER_WINDOW = "LOGGER_WINDOW";
export const DEBUG = "debug";

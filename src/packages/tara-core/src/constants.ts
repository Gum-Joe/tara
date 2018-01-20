// Constants
import * as path from "path";

// Windows settings
export const DEFAULT_WIDTH: number = 1280;
export const DEFAULT_HEIGHT: number = 720;
// Env & type strings
export const DEV_ENV: string = "development";
export const TYPE_PLUGIN: string = "plugin";
// File locations
export const TARA_CONFIG: string = path.resolve(__dirname, "../config"); // Should be $HOME/.tara
export const TARA_CONFIG_DBS: string = path.join(TARA_CONFIG, "db");
export const TARA_TMP_DB: string = path.join(TARA_CONFIG_DBS, "tara", "tmp");
export const CONFIG_FILE: string = "config.json";
export const TARA_PACKAGES: string = path.resolve(__dirname, "../packages");
export const THEME_FILE: string = path.resolve(__dirname, "../css/get-theme.scss");
export const PLUGIN_LOCATION: string = path.resolve(__dirname, path.join(TARA_CONFIG, "plugins"));
export const PLUGIN_CONFIG: string = path.resolve(__dirname, path.join(PLUGIN_LOCATION, "package.json"));
export const PLUGIN_CORE_LOCATION: string = path.resolve(__dirname, TARA_PACKAGES);
export const PLUGIN_CORE_CONFIG: string = path.resolve(__dirname, path.join(PLUGIN_CORE_LOCATION, "package.json"));
export const LAYOUT_LOCATION: string = path.resolve(__dirname, path.join(TARA_CONFIG, "layout.json"));
export const LAYOUT_LOCATION_DEFAULT: string = path.resolve(__dirname, path.join(TARA_CONFIG, "layout-default.json"));
export const LAYOUT_SETUP_DONE_LOCATION: string = path.resolve(__dirname, path.join(TARA_CONFIG, "layout-setup.json"));
// CLI args
export const REGEN_LAYOUT_ARGS: string = "--regen-layout";
// IPC stuff
export const GET_PLUGIN_CLIENT: string = "GET_PLUGIN_CLIENT";
export const SEND_PLUGIN_CLIENT: string = "SEND_PLUGIN_CLIENT";
export const IPC_GET_PLUGINS: string = "IPC_GET_PLUGINS";
export const IPC_SEND_PLUGINS: string = "IPC_SEND_PLUGINS";
// Theme stuff
export const THEME_FILE_CONTENTS_DEFAULT: string = `// Theme file for tara
// Contains theme name & import for theme file
// DO NOT EDIT
$theme:`;

// Logger
export const WINDOW_TYPE: "WINDOW" = "WINDOW";
export const WINDOW_SENT_TYPE: "WINDOW_SENT" = "WINDOW_SENT";
export const PROCESS_TYPE: "PROCESS" = "PROCESS";
export const LOGGER_WINDOW: "LOGGER_WINDOW" = "LOGGER_WINDOW";
export const DEBUG: "debug" = "debug";

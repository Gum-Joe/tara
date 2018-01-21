/**
 * @overview Loads theme
 * @deprecated
 */
import { blue, green, yellow } from "chalk";
import fs from "fs";
import { join, resolve } from "path";
const requireFoolWebpack = require("require-fool-webpack");
import Logger from "../logger.ts";
import { 
  TARA_CONFIG, 
  CONFIG_FILE, 
  THEME_FILE, 
  PLUGIN_LOCATION, 
  PLUGIN_CONFIG, 
  PLUGIN_CORE_LOCATION, 
  PLUGIN_CORE_CONFIG, 
  THEME_FILE_CONTENTS_DEFAULT
} from "../../packages/tara-core/src/constants";
import getPluginPath from "../utils/get-plugin-path";

// Config
const config = requireFoolWebpack(join(TARA_CONFIG, CONFIG_FILE));

const logger = new Logger({
  name: "theme"
});

/**
 * Gets a sass variable from a string
 * @function _getSassVar
 * @param {String} variable Variable to look for, in the from $name
 * @param {String} file String to look in
 * @returns {String} Value of variable
 * @private
 */
const _getSassVar = (variable, file) => {
  // Split the file at the theme
  const splitAtTheme = file.split(`${variable}: `);
  // Then chop off what remains
  const currentThemeRaw = splitAtTheme[1].split("\r\n")[0];
  // Then chop off quotes
  const theme = currentThemeRaw.split("\"")[1];
  // Now we have our theme
  return theme;
};

/**
 * Updates the theme in css/get-theme.scss
 * @function updateTheme
 * @returns {undefined} Nothing
 */
export default () => {
  logger.debug("Initialising theme...");
  // Get current var
  const themeFile = fs.readFileSync(THEME_FILE).toString("utf8");
  const currentTheme = _getSassVar("$theme", themeFile);
  // Check if it matches
  if (config.theme !== currentTheme) {
    logger.debug("Theme needs updating");
    logger.debug(`New Theme: ${green(config.theme)}`);
    logger.debug(`Old Theme: ${yellow(currentTheme)}`);
    const pluginPath = getPluginPath(config.theme);
    // Get theme entry
    const pluginPkgJSON = requireFoolWebpack(join(pluginPath, "package.json"));
    const themeFile = join(pluginPath, pluginPkgJSON.tara.theme);
    logger.debug(`Using theme file ${blue(join(themeFile))}.`);
    const newTheme = `${THEME_FILE_CONTENTS_DEFAULT} "${config.theme}"\n@import ${JSON.stringify(themeFile)}\n`;
    // Write
    logger.debug("Writing new theme file...");
    fs.writeFile(THEME_FILE, newTheme, (err) => {
      if (err) {
        throw err;
      }
      logger.debug("Theme written.");
    });
  } else {
    logger.debug("Theme is OK");
  }
};

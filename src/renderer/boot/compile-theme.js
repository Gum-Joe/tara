/**
 * @overview Compiles theme for tara
 */
import { cyan, blue, red } from "chalk";
import sass from "node-sass";
import { join } from "path";
import getPluginPath from "../utils/get-plugin-path";
import { TARA_CONFIG, CONFIG_FILE } from "../../packages/tara-core/src/constants.ts";
import Logger from "../../packages/tara-core/src/logger.ts";
const requireFoolWebpack = require("require-fool-webpack");

// Config
const config = requireFoolWebpack(join(TARA_CONFIG, CONFIG_FILE));

const logger = new Logger({
  name: "theme"
});

 export default () => {
   return new Promise((resolve, reject) => {
     logger.debug("Compiling theme....");
     const pluginPath = getPluginPath(config.theme);
     // Get theme entry
     const pluginPkgJSON = requireFoolWebpack(join(pluginPath, "package.json"));
     const themeFile = join(pluginPath, pluginPkgJSON.tara.theme);
     logger.debug(`Using theme file ${blue(join(themeFile))}.`);
     // HTML
     let html = "";
     if (pluginPkgJSON.tara.hasOwnProperty("html")) {
       logger.debug("Getting HTML...");
       const themeHTML = requireFoolWebpack(join(pluginPath, pluginPkgJSON.tara.html));
       if (themeHTML.hasOwnProperty("__esModule") && themeHTML.__esModule) {
         html = themeHTML.default; // Using ESModule, so expect default export to be used
       } else {
         // Use module.exports
         html = themeHTML;
       }
     }
     // Compile
     sass.render({
       file: themeFile
     }, (err, result) => {
       logger.debug("Compiled theme to css.");
       if (err) {
         reject(err);
       } else {
        resolve({
          css: result.css.toString("utf8"),
          html,
        });
       }
     });
   })
 }
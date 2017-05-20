/**
 * @overview Runs startup scripts, such as plugin load & updater
 */
import { series } from "async";
import Logger from "./logger";
import { loadPlugins, genLayout, mainProcess } from "./boot";
import { PLUGIN_CONFIG, PLUGIN_LOCATION, PLUGIN_CORE_CONFIG, PLUGIN_CORE_LOCATION } from "./constants";

const logger = new Logger({
  name: "startup"
});

/**
 * Startup runner
 * @function startup
 * @returns {undefined} Nothing
 */
export default async () => {
  logger.debug("Loading core plugins...");
  // Load core plugins
  const plugins_core = loadPlugins(PLUGIN_CORE_CONFIG, PLUGIN_CORE_LOCATION);
  logger.debug("Loading installed plugins...");
  // Load plugins
  const plugins_installed = loadPlugins(PLUGIN_CONFIG, PLUGIN_LOCATION);
  logger.info("Running startup tasks...");
  // Start out main process stuff
  mainProcess.mainProcessActions();
  // Start main process stuff from plugins
  mainProcess.startMainProcessPlugins(plugins_core, PLUGIN_CORE_LOCATION);
  mainProcess.startMainProcessPlugins(plugins_installed, PLUGIN_LOCATION);
  // Create layout
  series([
    done => { logger.info("Generating core layout..."); genLayout(plugins_core, PLUGIN_CORE_LOCATION, done); },
    done => { logger.info("Generating layout from installed plugins..."); genLayout(plugins_installed, PLUGIN_LOCATION, done); }
  ]);
  // Create theme
};

/**
 * @overview Runs startup scripts, such as plugin load & updater
 */
import Logger from "./logger";
import { loadPlugins, genLayout } from "./boot";

const logger = new Logger({
  name: "startup"
});

/**
 * @function Startup runner
 */
export default () => {
  logger.info("Running startup tasks...");
  logger.debug("Loading plugins...");
  // Load plugins
  const plugins = loadPlugins();
  // Create layout
  logger.info("Generating layout...");
  genLayout(plugins);
  // Create theme
};

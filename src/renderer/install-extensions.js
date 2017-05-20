/**
 * @overview Install dev tools
 */
import { blue } from "chalk";
import installExtension, { REACT_DEVELOPER_TOOLS, REDUX_DEVTOOLS } from "electron-devtools-installer";
import { DEV_ENV } from "./constants";
import Logger from "./logger";

// Logger
const logger = new Logger({
  name: "extensions"
});

export default function installExtensions() {
  // Only install if dev env
  if (process.env.NODE_ENV === DEV_ENV) {
    logger.info("Adding extensions...");
    installExtension(REACT_DEVELOPER_TOOLS)
      .then((name) => logger.info(`Added Extension:  ${blue(name)}`))
      .catch((err) => logger.throw(err));
    installExtension(REDUX_DEVTOOLS)
      .then((name) => logger.info(`Added Extension:  ${blue(name)}`))
      .catch((err) => logger.throw(err));
  }
}

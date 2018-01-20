/**
 * @overview Index of tara-core
 */

import config from "./config";
import * as constants from "../../tara-explorer/lib/constants";
import installExtensions from "./install-extensions";
import * as interfaces from "./interfaces";
import logger from "./logger";
import pluginClient from "./plugin-client";
import pluginInit from "./plugin-init";
import plugins from "./plugins";

export default {
    config,
    constants,
    installExtensions,
    interfaces,
    logger,
    pluginClient,
    pluginInit,
    plugins,
};

/**
 * @overview Tara's explorer entry point
 * @module tara/explorer
 */
import { join } from "path";
import actions from "./actions";
import constants from "./constants";

const api = {
  constants,
  actions
};

const main = (tara) => {
  tara.addApi("explorer", {
    constants,
    actions
  });
  tara.getClient().loadScript(join(tara.getPluginPathSync(tara.plugin.name), "browser/index.js"));
  tara.logger.info("Explorer started.");
};

module.exports = {
  main,
  api
};

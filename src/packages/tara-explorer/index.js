/**
 * @overview Tara's explorer entry point
 * @module tara/explorer
 */
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
  tara.logger.info("Explorer started.");
};

module.exports = {
  main,
  api
};

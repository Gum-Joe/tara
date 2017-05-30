/**
 * @overview Tara's explorer entry point
 * @module tara/explorer
 */
import constants from "./constants";

const api = {
  constants: constants
};

const main = (tara) => {
  tara.addApi("explorer", {
    constants
  });
  tara.logger.info("Explorer started.");
};

module.exports = {
  main,
  api
};

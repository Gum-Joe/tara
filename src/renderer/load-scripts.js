/**
 * @overview Script loader for window
 */
import electron from "electron"; // eslint-disable-line
import { join } from "path";
import Config from "../shared/config.ts";
import { TARA_CONFIG, CONFIG_FILE } from "../renderer/constants";
import Client from "../renderer/boot/plugin-client.ts";
import Logger from "../renderer/logger";

const config = new Config(join(TARA_CONFIG, CONFIG_FILE));

for (let script of config.config.window.scripts) {
  const scriptToRun = require(script).default;
  scriptToRun(new Client(
    {},
    electron,
    new Logger({
      name: "script"
    })
  ));
}

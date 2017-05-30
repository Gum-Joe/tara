/**
 * @overview Plugins event listeners
 */
import { IPC_GET_PLUGINS, IPC_SEND_PLUGINS, PLUGIN_CONFIG, PLUGIN_LOCATION, PLUGIN_CORE_CONFIG, PLUGIN_CORE_LOCATION } from "../../constants";
import getPlugins from "../plugins";

/**
 * Plugin event listener to send plugins.  Takes constants.IPC_GET_PLUGINS for receiving & sends back constants.IPC_SEND_PLUGINS
 * @param {TaraPlugin} tara class to use for plugin events
 * @returns {undefined} Nothing
 */
export function sendPlugins(tara) {
  tara.addEventListener("core", IPC_GET_PLUGINS, (event, data) => {
    tara.logger.debug("Plugins requested. Sending...");
    event.sender.send(`core::${IPC_SEND_PLUGINS}`, [
      ...getPlugins(PLUGIN_CONFIG, PLUGIN_LOCATION),
      ...getPlugins(PLUGIN_CORE_CONFIG, PLUGIN_CORE_LOCATION)
    ]);
  });
}

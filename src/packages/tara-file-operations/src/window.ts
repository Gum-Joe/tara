/**
 * @overview Opens pasteing status window
 * @module tara-file-operations/paste
 */
import { app, BrowserWindow } from "electron";
import { enableLiveReload } from "electron-compile";
import TaraPlugin from "../../../renderer/boot/plugin-init";
import { DEV_ENV } from "../../../renderer/constants";
import installExtensions from "../../../renderer/install-extensions";

/**
 * Creates copy/delete/move window.
 * @param {TaraPlugin} tara Tara plugin class
 */
export default (tara: TaraPlugin) => {
  // Keep a global reference of the window object, if you don't, the window will
  // be closed automatically when the JavaScript object is garbage collected.
  let mainWindow;

  /**
   * Creates the electron window
   * @function createWindow
   * @returns {undefined} Nothing
   */
  const createWindow = async () => {
    tara.logger.info("Creating window for file action status...");

    // Create the browser window.
    mainWindow = new BrowserWindow({
      width: 857,
      height: 325,
    });

    // and load the index.html of the app.
    mainWindow.loadURL(`file://${__dirname}/../html/index.html`);

    // Open the DevTools.
    if (process.env.NODE_ENV === DEV_ENV && !process.argv.includes("--no-devtools")) {
      mainWindow.webContents.openDevTools();
    }

    // Install extensions
    installExtensions();

    // Emitted when the window is closed.
    mainWindow.on("closed", () => {
      // Dereference the window object, usually you would store windows
      // in an array if your app supports multi windows, this is the time
      // when you should delete the corresponding element.
      mainWindow = null;
      tara.logger.debug("File actions window terminated.");
    });
  };

  // This method will be called when Electron has finished
  // initialization and is ready to create browser windows.
  // Some APIs can only be used after this event occurs.
  createWindow();

  // Enable HMR
  if (process.env.NODE_ENV === DEV_ENV) {
    enableLiveReload({ strategy: "react-hmr" });
  }
};

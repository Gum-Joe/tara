/**
 * @overview Entry script for electron
 * @description Loads windows & starts services.
 * From electron forge
 * @module tara/renderer
 */
import "babel-polyfill"; // ES6 Polyfill
import { app, BrowserWindow } from "electron"; // eslint-disable-line
import { enableLiveReload } from "electron-compile";
import { DEFAULT_WIDTH, DEFAULT_HEIGHT, DEV_ENV } from "./constants";
import installExtensions from "./install-extensions";
import Logger from "./logger.ts";
import startup from "./startup";

// Logger
const logger = new Logger({
  name: "startup"
});

// Startup actions
// that must be executed before render
startup();

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

// Handle promise rejects
process.on("unhandledRejection", (reason, promise) => { throw reason; });

/**
 * Creates the electron window
 * @function createWindow
 * @returns {undefined} Nothing
 */
const createWindow = async () => {
  logger.info("Creating window...");

  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: DEFAULT_WIDTH,
    height: DEFAULT_HEIGHT
  });

  // and load the index.html of the app.
  mainWindow.loadURL(`file://${__dirname}/../html/index.html`);
  mainWindow.maximize();

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
    logger.debug("Window terminated.");
  });
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", createWindow);

// Enable HMR
if (process.env.NODE_ENV === DEV_ENV) {
  enableLiveReload({ strategy: "react-hmr" });
}

// Quit when all windows are closed.
app.on("window-all-closed", () => {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== "darwin") {
    logger.info("Terminating Application...");
    app.quit();
  }
});

app.on("activate", () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    logger.debug("OSX: Launching Application...");
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.

/**
 * @overview Entry point for tara-file-operations
 * @module tara-file-operations
 */
import { ipcMain } from "electron";
import { join } from "path";
import { PluginInit as Tara } from "tara-core";
import { FILE_OPS_GET_FILES, FILE_OPS_SEND_FILE_LIST_ITEM, FILE_OPT_OPEN_WINDOW } from "./constants";
import getFiles from "./get-files";
import load_window from "./window";

interface FilesOBJ {
  files: string[];
  dest: string;
}

// Items
const items = [
  { label: "Open", click: join(__dirname, "open.js"), id: 0 },
  { label: "Open in new window", click: join(__dirname, "open-window.js"), id: 1 },
  { type: "separator", id: 2 },
  { label: "Cut", click: join(__dirname, "cut.js"), id: 3 },
  { label: "Copy", click: join(__dirname, "copy.js"), id: 4 },
  { label: "Paste", click: join(__dirname, "paste/index.js"), id: 5 },
  { label: "Delete", click: join(__dirname, "delete.js"), id: 6 },
];

export async function script(tara: Tara) {
  tara.logger.debug("Loading menu items...");
  try {
    const api = await tara.getPlugin("tara-right-click-menu");
    const menu = api.createMenu("explorer-files");
    for (let item of items) {
      menu.append(item);
    }
    menu.listen();
  } catch (err) {
    console.error(err.stack);
    throw err;
  }
}

export function main(tara: Tara) {
  tara.logger.debug("Starting listenners for file operations..");
  // Listeners
  ipcMain.on(FILE_OPT_OPEN_WINDOW, (event: Event) => {
    event.preventDefault();
    load_window(tara);
  });

  ipcMain.on(FILE_OPS_GET_FILES, (event: Electron.Event, files: FilesOBJ) => {
    event.preventDefault();
    getFiles(event, files.files, files.dest, "", (filesIndex, totalSizeBytes) => {
      event.sender.send(FILE_OPS_SEND_FILE_LIST_ITEM, {
        index: filesIndex,
        sizeBytes: totalSizeBytes,
      });
    });
  });
}

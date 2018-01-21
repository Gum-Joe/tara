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
  { label: "Open", click: join(__dirname, "open.ts"), id: 0 },
  { label: "Open in new window", click: join(__dirname, "open-window.ts"), id: 1 },
  { type: "separator", id: 2 },
  { label: "Cut", click: join(__dirname, "cut.ts"), id: 3 },
  { label: "Copy", click: join(__dirname, "copy.ts"), id: 4 },
  { label: "Paste", click: join(__dirname, "paste/index.ts"), id: 5 },
  { label: "Delete", click: join(__dirname, "delete.ts"), id: 6 },
];

export function main(tara: Tara) {
  tara.logger.debug("Loading menu items...");
  tara.getPlugin("tara-right-click-menu")
    .then((api) => api.createMenu("explorer-files"))
    .then(async (menu) => {
      for (let item of items) {
        await menu.append(item);
      }
    });

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

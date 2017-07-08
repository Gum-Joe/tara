/**
 * @overview Entry point for tara-file-operations
 * @module tara-file-operations
 */
import { join } from "path";
import Tara from "../../../renderer/boot/plugin-init";

// Items
const items = [
  { label: "Open", click: join(__dirname, "open"), id: 0 },
  { label: "Open in new window", click: join(__dirname, "open-window"), id: 1 },
  { type: "separator", id: 2 },
  { label: "Cut", click: join(__dirname, "cut"), id: 3 },
  { label: "Copy", click: join(__dirname, "copy"), id: 4 },
  { label: "Paste", click: join(__dirname, "paste"), id: 5 },
  { label: "Delete", click: join(__dirname, "delete"), id: 6 },
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
}

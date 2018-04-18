/**
 * @overview Default states
 */
import { homedir } from "os";
import { join } from "path";

export const dir = {
  // Controls the default dir to open
  // Should be config.user.openTo
  dir: homedir()
};

export const selectedFiles = [];

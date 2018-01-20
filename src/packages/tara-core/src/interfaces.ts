/**
 * @overview Interfaces for typescript
 */
import { DEBUG } from "./constants";

export interface PackageJSON {
  name: string;
  version: string;
  description: string;
  main: string;
  scripts: {
    test: string;
  };
  tara: {
    type: string;
  };
}

export interface Config {
  theme: string;
  window: {
    scripts: string[];
  };
}

export interface Logger {
  name: string;
  windowLogger?: boolean;
}

export interface LoggerTypes {
  level: "info" | "warn" | "error" | "debug";
  colour: string;
  text: string;
  args: Logger;
}

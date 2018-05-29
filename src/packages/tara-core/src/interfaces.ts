/**
 * @overview Interfaces for typescript
 */
import { DEBUG } from "./constants";

export interface PackageJSON {
  name: string;
  main: string;
  tara: {
    type: string;
    client: string; // React component to put into layout (panel)
    mainProcess: string; // Code to run on main process (the renderer/loader)
    script: string; // Code to run on client (window) that is not a react components
    api: string // Location of api code to load
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

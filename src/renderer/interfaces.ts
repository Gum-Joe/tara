/**
 * @overview Interfaces for typescript
 */

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
}

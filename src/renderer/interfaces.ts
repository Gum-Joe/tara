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

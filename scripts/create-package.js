/**
 * @overview Create a tara lerna package
 * @module scripts
 */
/* eslint import/no-extraneous-dependencies: 0 */
const { green } = require("chalk");
const fs = require("fs");
const mkdirp = require("mkdirp");
const { resolve, join } = require("path");
const inquirer = require("inquirer");
const { version } = require("../lerna");
const copy = require("../src/renderer/utils/copy").default;

// Constants
const PACKAGE_DIR = "src/packages";
const DEFAULT_PKG_JSON = "scripts/defaults/default-package.json";
const START_TIME = Date.now();

console.log(`${green("info")} Generating a new lerna package...`);
inquirer.prompt([
  { type: "input", message: "What is the name of the package to generate?", name: "name" },
  { type: "input", message: "What version number should we use?", default: version, name: "version" },
  { type: "input", message: "Describe you package (description):", name: "description" },
  { type: "input", message: "Keywords:", name: "keywords" },
  { type: "list", message: "What type of package should we generate?", choices: ["plugin", "theme"], name: "type" }
])
  .then((ans) => {
    const pkgDir = join(process.cwd(), PACKAGE_DIR, ans.name);
    console.log(`${green("info")} Making package dir...`);
    mkdirp(pkgDir);
    console.log(`${green("info")} Copying default package.json...`);
    copy(resolve(process.cwd(), DEFAULT_PKG_JSON), join(pkgDir, "package.json"))
      .then(() => {
        console.log(`${green("info")} Modifying package.json...`);
        const pkgJSON = require(join(pkgDir, "package.json"));
        // Setup object so we can just Object.assign()
        const jsonAdd = Object.assign({}, ans);
        jsonAdd.tara = {
          type: jsonAdd.type
        };
        Reflect.deleteProperty(jsonAdd, "type");
        const newPkgJSON = Object.assign(pkgJSON, jsonAdd);
        // Write
        console.log(`${green("info")} Writing new package.json...`);
        fs.writeFile(join(pkgDir, "package.json"), JSON.stringify(newPkgJSON, null, " "), (err) => {
          if (err) {
            throw err;
          } else {
            console.log(`${green("info")} Done in ${Date.now() - START_TIME}ms.`);
            console.log(`${green("info")} Note: You will need to manually add the package to package.json`);
          }
        });
      });
  })
  .catch((err) => {
    throw err;
  });

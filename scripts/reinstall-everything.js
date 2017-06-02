/**
 * @overview Script to reinstall everything after nodejs 8.0.0 upgarde
 */
const npm = require("npm");
const packageJSON = require("../package.json");
let prod = [];
let dev = [];

console.log("Reinstalling all packages, one by one");
console.log("Packages to reinstall:");
console.log("");
console.log("production:");
for (let pack in packageJSON.dependencies) {
  if (packageJSON.dependencies.hasOwnProperty(pack)) {
    console.log(` ${pack}@${packageJSON.dependencies[pack]}`);
    prod.push(`${pack}@${packageJSON.dependencies[pack]}`);
  }
}
console.log("");
console.log("development:");
for (let pack in packageJSON.devDependencies) {
  if (packageJSON.devDependencies.hasOwnProperty(pack)) {
    console.log(` ${pack}@${packageJSON.devDependencies[pack]}`);
    dev.push(`${pack}@${packageJSON.devDependencies[pack]}`);
  }
}

console.log("Installing production deps...");
npm.load({
    loaded: false
}, function (e) {
  if (e) {
    throw e;
  }
  // catch errors
  npm.commands.install(prod, function (err, data) {
      // log the error or data
      if (err) {
        throw err;
      } else {
        //console.log(data);
      }
    });
  npm.on("log", function (message) {
    // log the progress of the installation
    console.log(message);
  });
});

console.log("Installing dev deps...");
npm.load({
    loaded: false
}, function (e) {
  if (e) {
    throw e
  }
  // catch errors
  npm.commands.install(dev, function (err, data) {
      // log the error or data
      if (err) {
        throw err;
      } else {
        //console.log(data);
      }
    });
  npm.on("log", function (message) {
    // log the progress of the installation
    console.log(message);
  });
});

const { join } = require("path");

const appRoot = join(__dirname, '..');

require('electron-compile').init(appRoot, require.resolve('../src'));
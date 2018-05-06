/**
 * Bodge to get coloured logs
 */
const { createReadStream, watch } = require("fs");
const log = require("single-line-log").stdout;

watch("./log/log.log", () => {
    const logFile = createReadStream("./log/log.log");
    logFile.on("data", data => log(data))
});
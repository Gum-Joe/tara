/**
 * @overview Logging module for tara, from coapack
 * @module logger
 */
const chalk = require("chalk");

export default class Logger {
  constructor(args) {
    this.args = args || {};
    this.argv = process.argv;
    this.isDebug = this.argv.includes("--debug") || this.argv.includes("--verbose") || this.argv.includes("-v") || process.env.DEBUG;
  }

  // Logger methods
  /**
   * Basic Logger
   * @param level {String} Log Level
   * @param colour {String} colour of string
   * @param text {String} Text to log
   */
  _log(level, colour, text) {
    if (!this.argv.includes("--silent")) {
      // Add prefix
      let prefix = "";
      if (this.args.hasOwnProperty("name")) {
        prefix = chalk.magenta(this.args.name) + " "; // eslint-disable-line prefer-template
      }
      console.log(`${prefix}${chalk[colour](level)} ${text}`);
    }
  }
  /*
   * Info method
   * @color green
   */
  info(text) {
    this._log("info", "green", text);
  }

  /*
   * Warn method
   * @color green
   */
  warn(text) {
    if (!this.argv.includes("--silent")) {
      // Add prefix
      let prefix = "";
      if (this.args.hasOwnProperty("name")) {
        prefix = chalk.magenta(this.args.name) + " "; // eslint-disable-line prefer-template
      }
      console.warn(`${prefix}${chalk.yellow("warn")} ${text}`);
    }
  }
  /*
   * Error method
   * @color green
   */
  err(text) {
    if (!this.argv.includes("--silent")) {
      // Add prefix
      let prefix = "";
      if (this.args.hasOwnProperty("name")) {
        prefix = chalk.magenta(this.args.name) + " "; // eslint-disable-line prefer-template
      }
      console.error(`${prefix}${chalk.red("err")} ${text}`);
    }
  }

  /*
   * Debug/verbose method
   * @color green
   */
  debug(text) {
    if (this.isDebug) {
      this._log("debug", "cyan", text);
    }
  }

  /*
   * Throw an Error
   * @param err {Error} Error to throw
   * @throw Error
   */
  throw(err) {
    this.throw_noexit(err);
    process.exit(1);
  }

  /**
   * Throw without exit method
   * @colour red
   * @param err {Error} error to throw
   * From Bedel
   */
  throw_noexit(err) {
    if (!this.argv.includes("--silent")) {
      this.err("");
      this.err(`${err.stack.split("\n")[0]}`);
      this.err("");
      if (this.isDebug || process.env.NODE_ENV !== "production") {
        this.err("Full error:");
        this.err("");
        let e = 0;
        for (e of err.stack.split("\n")) {
          this.err(e);
        }
      }
      this.err("");
    }
  }

}

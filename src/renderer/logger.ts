/**
 * @overview Logging module for tara, from coapack
 * @module logger
 */
import * as chalk from "chalk";
import { ipcRenderer as ipc } from "electron";
import { Logger as LoggerArgs } from "./interfaces";

const WINDOW_TYPE = "WINDOW";
const WINDOW_SENT_TYPE = "WINDOW_SENT";
const PROCESS_TYPE = "PROCESS";
const LOGGER_WINDOW = "LOGGER_WINDOW";
const DEBUG = "debug";

export default class Logger {
  private args: LoggerArgs;
  private argv: string[];
  private isDebug: boolean;
  private type: "WINDOW" | "PROCESS" | "WINDOW_SENT";

  constructor(args: LoggerArgs) {
    this.args = args || { name: "logger" };
    this.argv = process.argv;
    this.isDebug = this.argv.includes("--debug") || this.argv.includes("--verbose") || this.argv.includes("-v") || process.env.DEBUG;
    // Get type
    if (typeof window !== "undefined") {
      this.type = WINDOW_TYPE;
    } else {
      this.type = PROCESS_TYPE;
      // Start listening
      if (args.windowLogger) {
        const { ipcMain } = require("electron");
        ipcMain.on(LOGGER_WINDOW, (event, log) => {
          event.preventDefault();
          this._log(log.level, log.colour, log.text, WINDOW_SENT_TYPE, log.args);
        });
      }
    }
  }

  // Logger methods
  /**
   * Basic Logger
   * @param level {String} Log Level
   * @param colour {String} colour of string
   * @param text {String} Text to log
   * @param type {WINDOW_TYPE|PROCESS_TYPE} What sent the log (window or main process)
   * @param args {LoggerArgs} Logger args
   * @private
   */
  private _log(level, colour, text, type = this.type, args = this.args) {
    if (!this.argv.includes("--silent")) {
      // Add prefix
      let prefix = "";
      if (args.hasOwnProperty("name")) {
        prefix = chalk.magenta(args.name) + " "; // eslint-disable-line prefer-template
      }
      switch (type) {
        case PROCESS_TYPE:
          prefix = `[${chalk.grey(PROCESS_TYPE)}] ${prefix}`;
          if (level !== DEBUG || this.argv.includes("--debug") || this.argv.includes("--verbose") || this.argv.includes("-v")) {
            console.log(`${prefix}${chalk[colour](level)} ${text}`);
          }
          break;
        case WINDOW_SENT_TYPE:
          // From render window
          prefix = `[${chalk.grey(WINDOW_TYPE)}] ${prefix}`;
          if (level !== DEBUG || this.argv.includes("--debug") || this.argv.includes("--verbose") || this.argv.includes("-v")) {
            console.log(`${prefix}${chalk[colour](level)} ${text}`);
          }
          break;
        // Handle sending -> process
        default:
          ipc.send(LOGGER_WINDOW, { level, colour, text, args: this.args });
          break;
      }
    }
  }
  /*
   * Info method
   * @public
   * @color green
   */
  public info(text) {
    this._log("info", "green", text);
  }

  /*
   * Warn method
   * @public
   * @color green
   */
  public warn(text) {
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
   * @public
   */
  public err(text) {
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
   * @public
   */
  public debug(text) {
    this._log(DEBUG, "cyan", text);
  }

  /*
   * Throw an Error
   * @param err {Error} Error to throw
   * @throw Error
   * @public
   */
  public throw(err) {
    this.throw_noexit(err);
    process.exit(1);
  }

  /**
   * Throw without exit method
   * @colour red
   * @param err {Error} error to throw
   * From Bedel
   * @public
   */
  public throw_noexit(err) {
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

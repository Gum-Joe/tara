/**
 * @overview File ops status area
 * @module tara-file-operations
 */
// TODO: Add interfaces for components, i.e. state and function, such as handleCopy()
import * as React from "react";
import FontAwesome from "react-fontawesome";
import { Circle } from "react-progressbar.js";
import { ipcRenderer } from "electron";
import * as fs from "fs";
import mkdirp from "mkdirp";
import { join, parse, relative } from "path";
import { Grid, Progress as ProgressBar } from "semantic-ui-react";
import * as DB from "nedb";
import { FILE_OPS_GET_FILES, FILE_OPS_SEND_FILE_LIST_ITEM } from "../constants";
import { TARA_CONFIG_DBS } from "tara-core/lib/constants";
import { Logger } from "tara-core";

const PREPARING_ICON = "<i class=\"fa fa-circle-o-notch fa-spin fa-fw\"></i>";

interface ProgressState {
  currentFile?: string;
  done?: string; // String version with units
  doneBytes?: number;
  message?: string;
  state?: string;
  eta?: string;
  speed?: string;
  totalSize?: string; // String version with units
  totalSizeBytes?: number;
  percentDone?: number; // Stored as value between 0 and 1
  percentDoneFile?: number; // Stored as value between 0 and 1
  numberOfFiles?: 0;
  startTime?: number; // UNIX time
}

// TODO: Refactor next two functions into one
/**
 * Handy function to determine best units to use for size by checking if current size < MAX_SIZE)
 * @param {Number} size Size in bytes
 * @param {String} units units (MB, GB, TB, PB, etc). Default: B (bytes)
 */
function determineSizeUnits(size: number, units: string = "B") {
  // Just in case
  const MAX_SIZE: number = 1024;
  const UNITS: string[] = [
    // Units in order of increasing size
    "B",
    "KB",
    "MB",
    "GB",
    "TB",
    "PB", // Petabyte
    "EB", // Exabyte
    "ZB", // Zetabyte
    "ZoB", // Zotabyte
    "BB", // Brontbyte
  ]

  // Check size
  if (size < MAX_SIZE) {
    return `${size.toFixed(2)} ${units}`;
  } else {
    // 1 of bigger unit or more. Recall function with next units
    const newSize = size / MAX_SIZE; // Divide to get bigger unit
    const newUnits = UNITS[UNITS.indexOf(units) + 1]; // Get new units by getting index of old ones and going one up
    return determineSizeUnits(newSize, newUnits); // Recall function
  }
}

/**
 * Handy function to determine best units to use for size by checking if current size < MAX_SIZE)
 * @param {Number} size Size in seconds
 * @param {String} units. Default: seconds
 */
function determineSizeUnitsTime(size: number, units: string = "seconds") {
  /**
   * Unit interface
   * @interface
   * @param {string} unit Time unit (i.e. mins, secs)
   */
  interface Unit {
    units: string;
    max: number;
  }

  // Just in case
  const MAX_SIZE: number = 60;
  const UNITS: Unit[] = [
    // Units in order of increasing size
    { units: "seconds", max: 60 },
    { units: "minutes", max: 60 },
    { units: "hours", max: 24 },
    { units: "days", max: 7 },
    { units: "weeks", max: 4.34524 } /* From Google */,
    { units: "months", max: 12 },
    { units: "years", max: Infinity },
  ];

  // Decapitalise units to ensure consistency
  let unitsToUse: string = units.toLowerCase();

  // First off, if units is UNITS[UNITS.length - 1].units (years) then just return rounded
  if (unitsToUse === UNITS[UNITS.length - 1].units) {
    return `${Math.round(size)} ${unitsToUse}`;
  }

  // New Size
  let newSize = size;

  // Then loop and check
  // NOTE: Might want to use binary search instead
  // TODO: Sort out relooping
  for (let unit of UNITS) {
    // If it's the right unit, check if it is greater than or equal to unit.max
    if (unit.units === unitsToUse && size >= unit.max) {
      const newUnitOBJ = UNITS[UNITS.indexOf(unit) + 1];
      unitsToUse = newUnitOBJ.units;
      newSize = Math.round(newSize / unit.max);
      break; // Loop not needed anymore
    }
  }

  // Return
  return `${newSize} ${unitsToUse}`;
}

export default class Progress extends React.Component<any, any> {
  private db: DB;
  public state: ProgressState;

  constructor(props) {
    super(props);
    this.state = {
      currentFile: "Generating file list...", // Show below "File status"
      done: "0 MB",
      doneBytes: 0,
      eta: "0", // in secs
      message: "Preparing...",
      numberOfFiles: 0, // Handy counter to make determining percentDone easier
      percentDone: 0,
      percentDoneFile: 0,
      speed: "0 MB/s",
      state: "Discovering files...", // Show below message
      totalSize: "0 MB",
      totalSizeBytes: 0,
    }
    this.db = new DB({ filename: join(TARA_CONFIG_DBS, "file-operations", "tmp.db"), autoload: true });
  }
  public componentWillMount() {
    // Here we get the action to to do
    this.db.find({}, (err, docs) => {
      if (err) {
        throw err;
      } else {
        // Got doc with either copy or move or delete in, use to run action
        const action = docs[docs.length - 1]; // Easy access to the action
        // TODO: Add other methods
        if (action.action === "copy") {
          // Handle copy action
          this.handleCopy(action);
        }
      }
    });
  }

  /**
   * Estimates write speed every 500 ms
   * by getting of bytes done in last 500ms
   * @param {Number} start UNIX time when action was started
   */
  private startSpeedEstimater(start: number) {
    const startTime = Date.now();
    setInterval(() => {
      // store bytes
      let initialBytes = this.state.doneBytes;
      // WAIT 500ms
      setTimeout(() => {
        const newBytes = this.state.doneBytes; // New bytes
        const deltaBytes = 2 * (newBytes - initialBytes); // Speed is file/s
        // Replace initialBytes with newBytes
        initialBytes = newBytes;
        // Set state
        this.setState({
          ...this.state,
          speed: `${determineSizeUnits(deltaBytes)}/s`,
        });
        // Get ETA with average
        const nowTime = Date.now();
        const deltaTime = nowTime - startTime;
        const averageSpeed = newBytes / deltaTime;
        // deltaBytes (currentSpeed) / averageSpeed -> times
        const remainingBytes = this.state.totalSizeBytes - this.state.doneBytes;
        const eta = deltaBytes / averageSpeed;
        // Set State
        this.setState({
          ...this.state,
          eta: determineSizeUnitsTime(eta)
        });
      }, 500);
    }, 100);
  }

  /**
   * Handles the copy action
   * @param {Object} action Files to copy
   * @returns {void} Nothing
   */
  private handleCopy(action) {
    const logger = new Logger({ name: "copy" });
    const dest = action.dest;
    logger.debug("Preparing to copy files...");
    logger.info("Generating files list...");
    // Ask process to get file list
    ipcRenderer.send(FILE_OPS_GET_FILES, { files: action.files, dest });
    ipcRenderer.on(FILE_OPS_SEND_FILE_LIST_ITEM, (event, files) => {
      logger.debug("Got file list from main process.  Starting copy...");
      this.startSpeedEstimater.bind(this)(Date.now());
      this.setState({
        ...this.state,
        message: "Copying files...",
        state: "",
        eta: "Estimating time remaining...",
        numberOfFiles: files.index.length,
        totalSizeBytes: files.sizeBytes,
        totalSize: determineSizeUnits(files.sizeBytes), // Convert Bytes -> smaller number, bigger units (i.e. bytes -> kilobytes)
        startTime: Date.now(),
      });

      // Begin copy
      for (let file of files.index) {
        // Reset
        this.setState({
          ...this.state,
          percentDoneFile: 0,
        });
        // Check if we are making dir or copying
        if (file.hasOwnProperty("mkdir")) {
          // Make dir
          logger.debug(`Making dir ${file.mkdir}`);
          this.setState({
            currentFile: `mkdir ${relative(dest, file.mkdir)}`,
          });
          mkdirp(file.mkdir);
        } else {
          // Copy file
          logger.debug(`Copying file ${file.from} -> ${file.to}`);
          this.setState({
            currentFile: `${parse(file.from).base} -> ${relative(dest, file.to)}`,
          });
          const read = fs.createReadStream(file.from);
          let bytesCopied = 0; // Keep a record of bytes done
          read.on("error", (err) => {
            logger.err("ERROR copying file!");
            logger.throw_noexit(err);
          });
          read.on("data", (buffer) => {
            // Get number of bytes copied
            bytesCopied += buffer.length;
            // Set
            this.setState({
              ...this.state,
              percentDoneFile: parseInt((bytesCopied / file.size).toFixed(2)),
              doneBytes: this.state.doneBytes + buffer.length,
              done: determineSizeUnits(this.state.doneBytes + buffer.length),
              percentDone: parseInt(((this.state.doneBytes + buffer.length) / this.state.totalSizeBytes).toFixed(2))
            });
          })
          read.on("end", () => {});
          read.pipe(fs.createWriteStream(file.to));
        }
      }
    });
  }

  public render() {
    return (
      <div className="file-ops-status">
        <Grid columns={3}>
          {/* First column: Overall progress (no. bytes done/no. bytes to do * 100) */}
          <Grid.Column className="file-ops-status-perc">
            <p className="file-ops-status-head" style={this.state.percentDone <= 0 ? { marginBottom: 0 } : {}}>Overall Progress</p>
            <Circle
              progress={this.state.percentDone}
              initialAnimate={true}
              text={`<p class="file-ops-status-overall-percent">${this.state.percentDone > 0 ? (this.state.percentDone * 100).toFixed(0) + "%" : PREPARING_ICON}</p><p class="file-ops-status-overall-done">${this.state.done}/${this.state.totalSize}</p>`}
              containerClassName="file-ops-status-overall"
            />
          <p className="file-ops-status-overall-speed">{this.state.speed}</p>
          </Grid.Column>

          {/* Second column: Messages, such as file being copied & ETA */}
          <Grid.Column className="file-ops-message">
            <p className="file-ops-message-head">{this.state.message}</p>
            <p className="file-ops-message-state">About {this.state.eta ? this.state.eta : ""} remaining</p>
            <p className="file-ops-message-state">{this.state.state}</p>
            <div className="file-ops-message-actions">
              {/* Pause & stop got here */}
              <FontAwesome name="pause-circle" size="2x"/>
              <FontAwesome name="stop-circle" size="2x"/>
            </div>
          </Grid.Column>

          {/* First column: Individual file progress (no. bytes of file done/no. bytes of file to do * 100) */}
          <Grid.Column className="file-ops-ind">
            <p className="file-ops-ind-head">File status</p>
            <p className="file-ops-ind-file">{this.state.currentFile}</p>
            <ProgressBar percent={this.state.percentDoneFile * 100} color="blue" indicating>{(this.state.percentDoneFile * 100).toFixed(0)}%</ProgressBar>
          </Grid.Column>
        </Grid>
      </div>
    )
  }
}

/**
 * @overview File ops status area
 * @module tara-file-operations
 */
import React, { Component } from "react";
import FontAwesome from "react-fontawesome";
import { Circle } from "react-progressbar.js";
import { ipcRenderer } from "electron";
import * as fs from "fs";
import mkdirp from "mkdirp";
import { join, parse, relative } from "path";
import { Grid, Progress as ProgressBar } from "semantic-ui-react";
import DB from "nedb";
import { FILE_OPS_GET_FILES, FILE_OPS_SEND_FILE_LIST_ITEM } from "../constants";
import { TARA_CONFIG_DBS } from "../../../../renderer/constants";
import Logger from "../../../../renderer/logger";

const PREPARING_ICON = "<i class=\"fa fa-circle-o-notch fa-spin fa-fw\"></i>";

/**
 * Handy function to determine best units to use for size by checking if current size < MAX_SIZE)
 * @param {Number} size Size in bytes
 * @param {String} units units (MB, GB, TB, PB, etc). Default: B (bytes)
 */
function determineSizeUnits(size, units = "B") {
  // Just in case
  const MAX_SIZE = 1024;
  const UNITS = [
    // Units in order of increasing size
    "B",
    "KB",
    "MB",
    "GB",
    "TB",
    "PB", // Petabyte
    "EB", // Exabyte
    "ZB", // Zetabyte
    "ZoB", //Zotabyte
    "BB", // Brontbyte
  ]

  // Check size
  if (size < MAX_SIZE) {
    return `${size.toFixed(2)} ${units}`;
  } else {
    // 1 of bigger unit or more. Recall function with next units
    const newSize = size / MAX_SIZE // Divide to get bigger unit
    const newUnits = UNITS[UNITS.indexOf(units) + 1]; // Get new units by getting index of old ones and going one up
    return determineSizeUnits(newSize, newUnits); // Recall function
  }
}

export default class Progress extends Component {
  constructor() {
    super();
    this.state = {
      message: "Preparing...",
      state: "Discovering files...", // Show below message
      currentFile: "Generating file list...", // Show below "File status"
      eta: "",
      speed: "0 MB/s",
      totalSize: "0 MB",
      totalSizeBytes: 0,
      done: "0 MB",
      doneBytes: 0,
      percentDone: 0,
      percentDoneFile: 0,
      numberOfFiles: 0 // Handy counter to make determining percentDone easier
    }
    this.db = new DB({ filename: join(TARA_CONFIG_DBS, "file-operations", "tmp.db"), autoload: true });
  }
  componentWillMount() {
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
          this.handleCopy(action)
        }
      }
    })
  }

  /**
   * Estimates write speed every 100 ms
   * by dividing no. of bytes done by seconds running
   * @param {Number} start UNIX time when action was started
   */
  startSpeedEstimater(start) {
    setInterval(() => {
      const currentBytes = this.state.doneBytes;
      const currentTimeUNIX = Date.now();
      const deltaTime = currentTimeUNIX - start;
      let speed = currentBytes / deltaTime;  // Bytes per second
      speed = `${determineSizeUnits(speed)}/s`;
      this.setState({
        ...this.state,
        speed
      })
    }, 100)
  }

  /**
   * Handles the copy action
   * @param {Object} action Files to copy
   */
  handleCopy(action) {
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
          logger.debug(`Making dir ${relative(dest, file.mkdir)}`);
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
            logger.err("ERROR copying file!")
            logger.throw_noexit(err);
          });
          read.on("data", (buffer) => {
            // Get number of bytes copied
            bytesCopied += buffer.length;
            // Set
            this.setState({
              ...this.state,
              percentDoneFile: (bytesCopied / file.size).toFixed(2),
              doneBytes: this.state.doneBytes + buffer.length,
              done: determineSizeUnits(this.state.doneBytes + buffer.length),
              percentDone: ((this.state.doneBytes + buffer.length) / this.state.totalSizeBytes).toFixed(2)
            });
          })
          read.on("end", () => {});
          read.pipe(fs.createWriteStream(file.to));
        }
      }
    });
  }

  render() {
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
            <p className="file-ops-message-state">{this.state.eta}</p>
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

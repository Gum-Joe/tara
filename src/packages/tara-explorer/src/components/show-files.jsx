/**
 * @overview Files grid handler
 */
import React, { Component } from "react";
import FontAwesome from "react-fontawesome";
import camelcase from "camelcase";
import { readdir, stat } from "fs";
import { join } from "path";
import PropTypes from "prop-types";
import { Grid } from "semantic-ui-react";
import { promisify } from "util";
import { updateDir as chdir, selectFile, deselectFile } from "../actions";
import { EXPLORER_TYPE_FILE, EXPLORER_TYPE_DIR, EXPLORER_TYPE_UNKNOWN } from "../constants";

const readdirAsync = promisify(readdir);
const statAsync = promisify(stat);

// Key store
// NOTE: From https://stackoverflow.com/questions/1828613/check-if-a-key-is-down
const keys = {};
window.onkeyup = event => keys[event.keyCode] = false;
window.onkeydown = event => keys[event.keyCode] = true;

/**
 * Truncates a filename if nescessary
 * @param {String} file Filename to truncate
 * @returns {String} Filename, truncated
 */
function truncateName(file) {
  const TRIM_LENGTH = 10;
  const TRIM_CAPS_LENGTH = 7;
  if (file.length > TRIM_LENGTH) {
    if (file.substring(0, TRIM_LENGTH).toUpperCase() === file.substring(0, TRIM_LENGTH)) {
      // Caps
      return `${file.substring(0, TRIM_CAPS_LENGTH)}...`;
    } else {
      return `${file.substring(0, TRIM_LENGTH)}...`;
    }
  } else {
    return file;
  }
}

/**
 * Normalises/sanitises a Filename
 * @param {String} filename File path to normalize
 * @returns {String} Normalised file name
 */
function normalise(filename) {
  const camelcased = camelcase(filename);
  const specialChars = [
    ".",
    "'",
    "#",
    ":",
    ";",
    "{",
    "}",
    " ",
    "(",
    ")",
    "@",
    "%",
    "$",
    "*"
  ];
  const replaceWith = ""; // Replace special Chars with this
  let fileNormal = camelcased;
  for (let char of specialChars) {
    fileNormal = fileNormal.split(char).join(replaceWith);
    if (char === specialChars[specialChars.length - 1]) {
      return fileNormal;
    }
  }
}

export default class Files extends Component {
  constructor(props) {
    super(props);

    this.state = {
      files: [], // [{ name: x, type: TARA_EXPLORER_DIR/TARA_EXPLORER_FILE }]
    }
  }

  componentDidMount() {
    this.getFiles(this.props.dir);
    // Assign global method to refresh
    global.explorerRefresh = async (dir) => {
      this.getFiles(dir);
    }
  }
  
  /**
   * Gets and sets the files list
   * @param {String} dir Directory to index
   * @returns {Promise} Async/await promise
   */
  async getFiles(dir) {
    // Create files list & grid
    const dirsWithMeta = [];
    const filesWithMeta = [];
    try {
      if (typeof dir !== "string") {
        throw new TypeError(`Expected a string for dir param, but got ${dir} of type ${typeof dir}`);
      }

      const files = await readdirAsync(dir); // Get files list
      // Get meta data for each
      for (const file of files) {
        try {
          const info = await statAsync(join(dir, file));
          if (info.isDirectory()) {
            dirsWithMeta.push({
            name: file,
            type: EXPLORER_TYPE_DIR
          });
          } else {
            filesWithMeta.push({
              name: file,
              type: EXPLORER_TYPE_FILE
            });
          }
        } catch (err) {
          console.error(`An error occured in the tara-explorer when getting the files list: ${err}`);
          // Only certain error should be caught
          // Some files the stats can't be read i.e. system files
          // so the program errors
          if (err.code !== "EBUSY") {
            continue; // Unable to throw error as loop locks up
            // throw err;
          } else {
            // Stick a question mark
            filesWithMeta.push({
              name: file,
              type: EXPLORER_TYPE_UNKNOWN
            });
          }
        }
      }
    } catch (err) {
      console.error(`An error occured in the tara-explorer when getting the files list:\n ${err.stack}`);
      throw err;
    } finally {
      // Update state
      this.setState({
         ...this.state,
         files: [...dirsWithMeta, ...filesWithMeta]
      });
    }
  }
  /**
   * Handle the onClick event
   * @param {String} id ID to look for
   * @returns {Function} onClick Event handler
   */
  handleOnClick(id) {
    return () => {
      // Handle
      if (!document.getElementById(id).className.includes("file-highlighted")) {
        document.getElementById(id).className += " file-highlighted";
        this.props.dispatch(selectFile(id));
        document.body.addEventListener("click", (event) => {
          // Check if this wasn't clicked
          // TODO: Add multiselect by usage of ctrl / shift
          if (event.path[0].id !== id && document.getElementById(id).className.includes("file-highlighted") && !keys[17] && !keys[16]) {
            this.handleOnClick(id)();
            document.body.removeEventListener("click", this, true);
          }
        }, true);
      } else {
        document.getElementById(id).className = document.getElementById(id).className.split(" file-highlighted").join("");
        this.props.dispatch(deselectFile(id));
      }
    };
  }
  render() {
    return (
      <Grid className="files">
        <Grid.Row>
          <Grid.Column size={2}>
                {
                  this.state.files.map(file => {
                    if (file.type === EXPLORER_TYPE_DIR) {
                      return (
                        <div
                          data-file={join(this.props.dir, file.name)}
                          id={normalise(file.name)}
                          role="presentation"
                          className="file-wrapper"
                          onContextMenu={this.handleOnClick(normalise(file.name))}
                          onClick={this.handleOnClick(normalise(file.name))}
                          onDoubleClick={() => { this.props.dispatch(chdir(join(this.props.dir, file.name))); global.explorerRefresh(join(this.props.dir, file.name)); }}
                        >
                          <FontAwesome name="folder" />
                          <p>{truncateName(file.name)}</p>
                        </div> 
                      );
                    } else if (file.type === EXPLORER_TYPE_FILE) {
                      return (
                        <div data-file={join(this.props.dir, file.name)} id={normalise(file.name)} role="presentation" className="file-wrapper" onClick={this.handleOnClick(normalise(file.name))}>
                          <FontAwesome name="file" />
                          <p>{truncateName(file.name)}</p>
                        </div>
                      );
                    } else {
                      return (
                        <div data-file={join(this.props.dir, file.name)} id={normalise(file.name)} role="presentation" className="file-wrapper" onClick={this.handleOnClick(normalise(file.name))}>
                          <FontAwesome name="question-circle " />
                          <p>{truncateName(file.name)}</p>
                        </div>
                      );
                    }
                  })
                }
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }
}

Files.propTypes = {
  dir: PropTypes.string.isRequired,
  dispatch: PropTypes.func.isRequired,
}
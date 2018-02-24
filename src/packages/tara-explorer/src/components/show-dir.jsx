/**
 * @overview Component to show files in dir
 * @module explorer
 */
import React, { Component } from "react";
import catchAwaitErr from "await-to-js";
import jquery from "jquery";
import camelcase from "camelcase";
import PropTypes from "prop-types";
import { join } from "path";
import { readdir, statSync, stat as fsStat } from "fs";
import { promisify } from "util";
import { Grid } from "semantic-ui-react";
import FontAwesome from "react-fontawesome";
import { Redirect } from "react-router-dom";
import { updateDir as chdir, selectFile, deselectFile } from "../actions";

// Promisify stat
const stat = promisify(fsStat);

// NOTE: From https://stackoverflow.com/questions/1828613/check-if-a-key-is-down
const keys = {};
window.onkeyup = function (event) { keys[event.keyCode] = false; };
window.onkeydown = function (event) { keys[event.keyCode] = true; };

/**
 * Truncates a filename if needed
 * @param {String} file Filename to truncate
 * @returns {String} Filename, truncated
 */
function getFileName(file) {
  const TRIM_LENGTH = 13;
  const TRIM_CAPS_LENGTH = 10;
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
 * Normalises a Filename
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

export default class Dir extends Component {
  constructor(props) {
    super(props);
    this.state = {
      contents: [],
      contentsReact: [],
      redirect: "",
    };
    props.dispatch(chdir(props.match.params.dir));
  }
  /**
   * Handle mapping files to react components
   * @returns {void}
   */
  componentDidMount() {
    this.setState({
      ...this.state,
      contentsReact: this.state.contents.map(async file => {
        const [err, fileStat] = await catchAwaitErr(stat(file));
        if (err) {
          throw err;
        }
        console.log(fileStat);
        if (fileStat.isDirectory()) {
          return (
            <div data-file={join(this.props.match.params.dir, file)} id={normalise(file)} role="presentation" className="file-wrapper" onContextMenu={this.handleOnClick(normalise(file))} onClick={this.handleOnClick(normalise(file))}>
              <FontAwesome name="folder" />
              <p>{getFileName(file)}</p>
            </div>
          );
        } else if (!fileStat.isDirectory()) {
          return (
            <div data-file={join(this.props.match.params.dir, file)} id={normalise(file)} role="presentation" className="file-wrapper" onClick={this.handleOnClick(normalise(file))}>
              <FontAwesome name="file" />
              <p>{getFileName(file)}</p>
            </div>
          );
        } else {
          throw new Error(`File ${file} is neither a directory or file!`)
        }
      })
    });
  }

  componentWillReceiveProps(props) {
    // Update dir
    if (props.dir.dir !== props.match.params.dir) {
      props.dispatch(chdir(props.match.params.dir));
    }
    // Get dirs
    this.getFiles(props.match.params.dir);
  }
  /**
   * Gets files in a dir & sets it to state
   * @param {String} dir dir to look
   * @returns {undefined} Nothing
   */
  getFiles(dir) {
    readdir(dir, async (err, files) => {
      if (err) {
        throw err;
      } else {
        this.setState({
          ...this.state,
          contents: files,
          dir: dir
        });
        // Check for double click
        for (let file of files) {
          const fileStat = await stat(join(dir, file));
          if (fileStat.isDirectory()) {
            jquery(`#${normalise(file)}`).dblclick(() => {
              const newDir = join(this.props.dir.dir, file);
              process.chdir(newDir);
              this.props.dispatch(deselectFile(normalise(file)));
              global.explorerHistory.push(`/dir/${newDir}`);
              this.props.dispatch(chdir(newDir));
            });
          } else {
            // Handle file opening
          }
        }
      }
    });
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
      <div>
        {/* Redirects */}
        { this.state.redirect !== "" ?
          this.state.redirect
          :
          <Grid className="files">
            <Grid.Row>
              <Grid.Column size={2}>
                { this.state.contentsReact }
              </Grid.Column>
            </Grid.Row>
          </Grid>
        }
      </div>
    );
  }
}

Dir.propTypes = {
  match: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired,
  dir: PropTypes.object.isRequired
};

/**
 * @overview Component to show files in dir
 * @module explorer
 */
import React, { Component } from "react";
import jquery from "jquery";
import camelcase from "camelcase";
import PropTypes from "prop-types";
import { join } from "path";
import { readdir, statSync } from "fs";
import { Grid } from "semantic-ui-react";
import FontAwesome from "react-fontawesome";
import { Redirect } from "react-router-dom";
import { updateDir as chdir } from "../actions";

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

export default class Dir extends Component {
  constructor() {
    super();
    this.state = {
      contents: [],
      redirect: ""
    };
  }
  componentDidMount() {
    // Get dirs
    this.getFiles(this.props.match.params.dir);
  }
  /**
   * Gets files in a dir & sets it to state
   * @param {String} dir dir to look
   * @returns {undefined} Nothing
   */
  getFiles(dir) {
    readdir(dir, (err, files) => {
      if (err) {
        throw err;
      } else {
        this.setState({
          ...this.state,
          contents: files,
          dir: dir
        });
        // Send dir message
        global.tara.getPlugin("tara-explorer")
          .then(api => global.tara.send("explorer", api.constants.EXPLORER_SEND_DIR, this.props.dir.dir));
        // Check for double click
        for (let file of this.state.contents) {
          jquery(`#${camelcase(file)}`).dblclick(() => {
            this.getFiles(`${join(this.props.dir.dir, file)}`);
            this.props.dispatch(chdir(join(this.props.dir.dir, file)));
          });
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
        document.body.addEventListener("click", (event) => {
          // Check if this wasn't clicked
          // TODO: Add multiselect by usage of ctrl / shift
          if (event.path[0].id !== id && document.getElementById(id).className.includes("file-highlighted") && !keys[17] && !keys[16]) {
            this.handleOnClick(id)();
          }
        }, true);
      } else {
        document.getElementById(id).className = document.getElementById(id).className.split(" file-highlighted").join("");
      }
    };
  }
  render() {
    return (
      <Grid className="files">
        <Grid.Row>
          <Grid.Column size={2}>
            {
              this.state.contents.map(file => (statSync(join(this.props.dir.dir, file)).isDirectory() ? // Check if path is dir
                <div id={camelcase(file)} role="presentation" className="file-wrapper" onClick={this.handleOnClick(camelcase(file))}>
                  <FontAwesome name="folder" />
                  <p>{getFileName(file)}</p>
                </div>
              : null))
            }
            {
              this.state.contents.map(file => (!statSync(join(this.props.dir.dir, file)).isDirectory() ? // Check if path is file
                <div id={camelcase(file)} role="presentation" className="file-wrapper" onClick={this.handleOnClick(camelcase(file))}>
                  <FontAwesome name="file" />
                  <p>{getFileName(file)}</p>
                </div>
              : null))
            }
          </Grid.Column>
        </Grid.Row>
        {/* Redirects */}
        { this.state.redirect !== "" ? <Redirect to={this.state.redirect} /> : null }
      </Grid>
    );
  }
}

Dir.propTypes = {
  match: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired,
  dir: PropTypes.object.isRequired
};

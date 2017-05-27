/**
 * @overview Component to show files in dir
 * @module explorer
 */
import React, { Component } from "react";
import PropTypes from "prop-types";
import { join } from "path";
import { readdir, statSync } from "fs";
import { Grid } from "semantic-ui-react";
import FontAwesome from "react-fontawesome";

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
      contents: []
    };
  }
  componentDidMount() {
    // Get dirs
    readdir(this.props.dir, (err, files) => {
      if (err) {
        throw err;
      } else {
        this.setState({
          contents: files
        });
      }
    });
  }
  render() {
    return (
      <Grid className="files">
        <Grid.Row>
          <Grid.Column size={2}>
            {
              this.state.contents.map(file => statSync(join(this.props.dir, file)).isDirectory() ? (
                <div className="file-wrapper">
                  <FontAwesome name="folder" />
                  <p>{getFileName(file)}</p>
                </div>
              ) : null)
            }
            {
              this.state.contents.map(file => !statSync(join(this.props.dir, file)).isDirectory() ? (
                <div className="file-wrapper">
                  <FontAwesome name="file" />
                  <p>{getFileName(file)}</p>
                </div>
              ) : null)
            }
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }
}

Dir.propTypes = {
  dir: PropTypes.string.isRequired
};

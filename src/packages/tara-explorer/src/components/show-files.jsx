/**
 * @overview Files grid handler
 */
import React, { Component } from "react";
import PropTypes from "prop-types";
import { readdir, stat } from "fs";
import { promisify } from "util";
import { TARA_TYPE_FILE, TARA_TYPE_DIR } from "../constants";

const readdirAsync = promisify(readdir);
const statAsync = promisify(stat);

export default class Files extends Component {
  constructor(props) {
    super(props);

    this.state = {
      files: [], // [{ name: x, type: TARA_EXPLORER_DIR/TARA_EXPLORER_FILE }]
    }
  }

  async componentDidMount() {
    // Create files list & grid
    try {
      const files = await readdirAsync(this.props.dir); // Get files list
      // Get meta data for each
      const filesWithMeta = [];
      for (const file of files) {
        const info = await statAsync(file);
        if (info.isDirectory()) {
          newFiles.push({
            name: file,
            type: TARA_TYPE_DIR
          });
        } else {
          newFiles.push({
            name: file,
            type: TARA_TYPE_FILE
          });
        }
      }
      // Update state
      this.setState({
        ...this.state,
        files: filesWithMeta
      });
      console.log(this.state.files);
    } catch (err) {
      console.error(err);
      throw err;
    }
  }
  render() {
    return (
      <div>
      <h1>Here is {this.props.dir}</h1>
      </div>
    );
  }
}

Files.propTypes = {
  dir: PropTypes.string.isRequired
}
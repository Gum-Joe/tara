/**
 * @overview Component to show files in dir
 * @module explorer
 */
import React, { Component } from "react";
import PropTypes from "prop-types";
import { readdir } from "fs";

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
      <ul>
        {this.state.contents.map(file => <li>{file}</li>)}
      </ul>
    );
  }
}

Dir.propTypes = {
  dir: PropTypes.string.isRequired
};

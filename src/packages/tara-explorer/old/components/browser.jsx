/**
 * @overview Wrapper for <ShowDir />
 */
import React, { Component } from "react";
import PropTypes from "prop-types";
import ShowDir from "../containers/show-dir";

export default class Browser extends Component {
  render() {
    return (
      <ShowDir match={this.props.match} />
    );
  }
}

Browser.propTypes = {
  match: PropTypes.object.isRequired
};

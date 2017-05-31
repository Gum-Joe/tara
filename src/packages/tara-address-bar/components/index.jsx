/**
 * @overview tara-address-bar windows entry point
 * @module address-bar
 */
import React, { Component } from "react";
import PropTypes from "prop-types";

export default class TaraAddressBar extends Component {
  render() {
    return (
      <p>{this.props.dir.dir}</p>
    );
  }
}

TaraAddressBar.propTypes = {
  dir: PropTypes.object.isRequired
};

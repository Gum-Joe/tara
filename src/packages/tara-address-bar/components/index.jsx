/**
 * @overview tara-address-bar windows entry point
 * @module address-bar
 */
import React, { Component } from "react";
import FontAwesome from "react-fontawesome";
import jquery from "jquery";
import PropTypes from "prop-types";

export default class TaraAddressBar extends Component {
  componentDidMount() {
    // Handle action click
    jquery(".tara-address-bar .fa-arrow-left").click(() => {
      global.explorerHistory.goBack();
    });
    jquery(".tara-address-bar .fa-arrow-right").click(() => {
      global.explorerHistory.goForward();
    });
  }
  render() {
    return (
      <div>
        <FontAwesome name="arrow-left" />
        <FontAwesome name="arrow-right" />
        <p className="current-dir">{this.props.dir.dir}</p>
      </div>
    );
  }
}

TaraAddressBar.propTypes = {
  dir: PropTypes.object.isRequired
};

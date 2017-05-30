/**
 * @overview tara-address-bar windows entry point
 * @module address-bar
 */
import React, { Component } from "react";
import PropTypes from "prop-types";

export default class TaraAddressBar extends Component {
  constructor() {
    super();
    this.state = {
      dir: "Waiting for dir...."
    };
  }
  componentDidMount() {
    // Get current dir
    global.tara.getPlugin("tara-explorer")
      .then(api => global.tara.addEventListener("explorer", api.constants.EXPLORER_SEND_DIR, (event, data) => {
        console.log(data);
      }));
  }

  render() {
    return (
      <p>{this.state.dir}</p>
    );
  }
}

TaraAddressBar.propTypes = {
  tara: PropTypes.object.isRequired
};

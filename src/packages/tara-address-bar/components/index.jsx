/**
 * @overview tara-address-bar windows entry point
 * @module address-bar
 */
import React, { Component } from "react";
import FontAwesome from "react-fontawesome";
import jquery from "jquery";
import PropTypes from "prop-types";
import DirPicker from "./dir-picker";

export default class TaraAddressBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      picker: null
    };
    this.handleDirClick = this.handleDirClick.bind(this);
    this.changeDir = this.changeDir.bind(this);
  }
  componentDidMount() {
    // Handle action click
    jquery(".tara-address-bar .fa-arrow-left").click(() => {
      global.explorerHistory.goBack();
    });
    jquery(".tara-address-bar .fa-arrow-right").click(() => {
      global.explorerHistory.goForward();
    });
  }
  /**
   * Changes the current dir (for dir picker)
   * @param {String} dir Dir to change to
   * @returns {undefined} Nothing
   */
  changeDir(dir) {
    this.props.tara.getPlugin("tara-explorer")
      .then((explorer) => this.props.dispatch(explorer.actions.updateDir(dir)));
    global.explorerHistory.push(`/dir/${dir}`);
    this.setState({
      picker: null
    });
  }
  /**
   * Handle Dir click to show text box
   * @returns {undefined} Nothing
   */
  handleDirClick() {
    this.setState({
      picker: <DirPicker dir={this.props.dir.dir} setDir={this.changeDir} />
    });
  }
  render() {
    return (
      <div>
        <FontAwesome name="arrow-left" />
        <FontAwesome name="arrow-right" />
        {
          this.state.picker === null ?
            <p className="current-dir" onClick={this.handleDirClick}>{this.props.dir.dir}</p>
            :
            this.state.picker
        }
      </div>
    );
  }
}

TaraAddressBar.propTypes = {
  dir: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired,
  tara: PropTypes.object.isRequired
};

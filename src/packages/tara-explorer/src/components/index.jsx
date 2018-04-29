/**
 * @overview Entry point for tara-explorer
 */
import React, { Component } from "react";
import { Provider } from "react-redux";
import PropTypes from "prop-types";
import Files from "./show-files";
import AddressBar from "./address-bar";

export default class Explorer extends Component {
  render() {
    return (
      <Provider store={global.store}>
        <div className="tara-explorer-wrapper">
          <AddressBar dir={this.props.dir} dispatch={this.props.dispatch} />
          <Files fs dir={this.props.dir.present.dir} dispatch={this.props.dispatch} />
        </div>
      </Provider>
    )
  }
}

Explorer.propTypes = {
  dir: PropTypes.object.isRequired
}
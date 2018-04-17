/**
 * @overview Entry point for tara-explorer
 */
import React, { Component } from "react";
import { Provider } from "react-redux";
import PropTypes from "prop-types";
import Files from "./show-files";

export default class Explorer extends Component {
  render() {
    return (
      <Provider store={global.store}>
        <Files fs dir={this.props.dir.dir} />
      </Provider>
    )
  }
}

Explorer.propTypes = {
  dir: PropTypes.object.isRequired
}
/**
 * @overview Tara's panel component, for creating panel for information
 */
import React, { Component } from "react";
import SplitPane from "react-split-pane";
import PropTypes from "prop-types";

/**
 * @name Panel
 * @description Creates a Panel for the client to view and to show data
 * Panels are made using panes,
 * which require their children to be an array
 */
export default class Panel extends Component {
  render() {
    return (
      <SplitPane split={this.props.direction} defaultSize={this.props.params.width} minSize={this.props.params.minWidth} maxSize={this.props.params.maxWidth}>
        { this.props.children }
      </SplitPane>
    );
  }
}

Panel.propTypes = {
  direction: PropTypes.oneOf(["vertical", "horizontal"]).isRequired,
  children: PropTypes.oneOfType(["object", "array"]).isRequired,
  params: PropTypes.object.isRequired
};

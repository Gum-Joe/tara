/**
 * @overview Tara's panel component, for creating panel for information
 */
import React, { Component } from "react";
import { Grid } from "semantic-ui-react";
import PropTypes from "prop-types";

/**
 * @name Panel
 * @description Creates a Panel for the client to view and to show data
 * Panels groups are made using semantic columns,
 * each group split into 16
 * So a panel should have a width of 1 to 16
 */
export class Panel extends Component {
  render() {
    return (
      <Grid.Column width={this.props.width}>
        {this.props.children}
      </Grid.Column>
    );
  }
}

Panel.propTypes = {
  width: PropTypes.number.isRequired
};

/**
 * @name PanelGroup
 * @description Panel group, streches to 100%
 */
export class PanelGroup extends Component {
  render() {
    return (
      <Grid celled>
        {this.props.children}
      </Grid>
    );
  }
}

/**
 * @name PanelRow
 * @description A row on the panel grid, streches to 100%
 */
export class PanelRow extends Component {
  render() {
    return (
      <Grid.Row>
        {this.props.children}
      </Grid.Row>
    );
  }
}

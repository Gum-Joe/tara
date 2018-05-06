/**
 * @overview Stores theme style header to use theme
 */

import React, { Component } from "react";
import PropTypes from "prop-types";
export default class ThemeStyleHeader extends Component {
  render() {
    return (
      <style>
        {this.props.themeCSS}
      </style>
    )
  }
}

ThemeStyleHeader.propTypes = {
  themeCSS: PropTypes.string.isRequired,
}
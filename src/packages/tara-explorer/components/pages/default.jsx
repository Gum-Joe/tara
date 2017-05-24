/**
 * @overview Default page for explorer
 * @module explorer
 */
import React, { Component } from "react";
import { Redirect } from "react-router-dom";

export default class DefaultPage extends Component {
  render() {
    return (
      /* For now we go to /dir/home (home dir) */
      <Redirect to="/dir/home" />
    );
  }
}

DefaultPage.propTypes = {

};

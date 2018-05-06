/**
 * @overview Default page for explorer
 * Modify this file to change the auto start dir
 * @module explorer
 */
import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import { homedir } from "os";

const autoStart = homedir();

export default class DefaultPage extends Component {
  render() {
    return (
      /* For now we go to /dir/home (home dir) */
      <Redirect push to={`/dir/${autoStart}`} />
    );
  }
}

DefaultPage.propTypes = {

};

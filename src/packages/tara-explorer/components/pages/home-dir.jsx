/**
 * @overview Component to show home dir
 * @todo Replace this with user defined one in config
 * @module explorer
 */
import React, { Component } from "react";
import { homedir } from "os";
import Dir from "../show-dir";

export default class HomeDir extends Component {
  render() {
    return (
      <Dir dir={homedir()} />
    );
  }
}

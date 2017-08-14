/**
 * @overview File ops status area
 * @module tara-file-operations
 */
import React, { Component } from "react";
import { Circle } from "react-progressbar.js";

export default class Progress extends Component {
  render() {
    return (
      <div className="file-ops-status">
        <p className="file-ops-status-head">Overall Progress</p>
        <Circle
          progress={0.5}
          initialAnimate={true}
          text={`<p class="file-ops-status-overall-percent">50%</p><p class="file-ops-status-overall-done">5GB/10GB</p>`}
          containerClassName="file-ops-status-overall"
        />
      <p className="file-ops-status-overall-speed">100 MB/s</p>
      </div>
    )
  }
}

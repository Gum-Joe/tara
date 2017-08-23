/**
 * @overview File ops status area
 * @module tara-file-operations
 */
import React, { Component } from "react";
import FontAwesome from "react-fontawesome";
import { Circle } from "react-progressbar.js";
import { Grid, Progress as ProgressBar } from "semantic-ui-react";

export default class Progress extends Component {
  render() {
    return (
      <div className="file-ops-status">
        <Grid columns={3}>
          <Grid.Column className="file-ops-status-perc">
            <p className="file-ops-status-head">Overall Progress</p>
            <Circle
              progress={0.5}
              initialAnimate={true}
              text={`<p class="file-ops-status-overall-percent">50%</p><p class="file-ops-status-overall-done">5GB/10GB</p>`}
              containerClassName="file-ops-status-overall"
            />
            <p className="file-ops-status-overall-speed">100 MB/s</p>
          </Grid.Column>
          <Grid.Column className="file-ops-message">
            <p className="file-ops-message-head">Copying files...</p>
            <p className="file-ops-message-state">About 1 minutes remaining...</p>
            <p className="file-ops-message-state">Copying C:\ISO\Win10.iso -> C:\OLD\Win10.iso</p>
            <div className="file-ops-message-actions">
              {/* Pause & stop got here */}
              <FontAwesome name="pause-circle" size="2x"/>
              <FontAwesome name="stop-circle" size="2x"/>
            </div>
          </Grid.Column>
          <Grid.Column className="file-ops-ind">
            <p className="file-ops-ind-head">File status</p>
            <p className="file-ops-ind-file">C:\ISO\Win10.iso -> C:\OLD\Win10.iso</p>
            <ProgressBar percent={50} color="blue" indicating progress/>
          </Grid.Column>
        </Grid>
      </div>
    )
  }
}

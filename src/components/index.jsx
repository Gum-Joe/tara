/**
 * @overview Tara's main react entry point for components
 */
import React, { Component } from "react";
import { Panel, PanelGroup, PanelRow } from "./panel";

export class Tara extends Component {
  render() {
    return (
      <PanelGroup>
        <PanelRow>
          <Panel width={1}>Hi</Panel>
          <Panel width={1}>Hi</Panel>
        </PanelRow>
      </PanelGroup>
    );
  }
}

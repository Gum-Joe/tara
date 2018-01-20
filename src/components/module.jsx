/**
 * @overview Contains module component to load a module with
 */
import electron from "electron"; // eslint-disable-line
import { join } from "path";
import React, { Component } from "react";
import PropTypes from "prop-types";
const requireFoolWebpack = require("require-fool-webpack");
import { PLUGIN_CONFIG, PLUGIN_LOCATION, PLUGIN_CORE_LOCATION } from "../renderer/constants";
import TaraPlugin from "../renderer/boot/plugin-init";

export default class Module extends Component {
  constructor(props) {
    super(props);
    // Default state
    this.state = {
      contents: (<h1>Module {props.module} needed</h1>)
    };
  }

  componentWillMount() {
    // Get plugin's client & listen for it
    const plugin_config = requireFoolWebpack(PLUGIN_CONFIG);
    let pluginJSON;
    let plugin_location;
    if (plugin_config.dependencies.hasOwnProperty(this.props.module)) {
      plugin_location = join(PLUGIN_LOCATION, this.props.module);
      pluginJSON = requireFoolWebpack(join(plugin_location, "package.json"));
      // Check if
    } else {
      plugin_location = join(PLUGIN_CORE_LOCATION, this.props.module);
      pluginJSON = requireFoolWebpack(join(plugin_location, "package.json"));
    }
    // Get & send
    if (pluginJSON.tara.hasOwnProperty("client")) {
      this.setState({ contents: requireFoolWebpack(join(plugin_location, pluginJSON.tara.client)).default });
    } else {
      this.setState({ contents: requireFoolWebpack(join(plugin_location, pluginJSON.main)).client });
    }
  }
  render() {
    return (<div className={`panel ${this.props.module}`}><this.state.contents tara={new TaraPlugin(this.props.module, electron)} /></div>);
  }
}

Module.propTypes = {
  module: PropTypes.string.isRequired
};

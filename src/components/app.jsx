/**
 * @overview Tara's main react entry point for components
 */
import React, { Component } from "react";
import createFragment from "react-addons-create-fragment";
import { join } from "path";
import PropTypes from "prop-types";
import Panel from "./panel";
import { updateLayoutConfig, updateLayoutRender, addPlugin } from "../actions";
import { PLUGIN_CONFIG, PLUGIN_LOCATION } from "../renderer/constants";
// Plugin config file
const plugins = require(PLUGIN_CONFIG);

/**
 * Tara entry point
 */
export default class Tara extends Component {
  async componentDidMount() {
    // Load plugins
    this.loadPlugins();
    // Render layout
    this.renderLayout();
  }
  /**
   * @function Loads plugins into store
   */
  loadPlugins() {
    // Grab each pkg.json and send to store
    for (let plugin in plugins.dependencies) {
      if (plugins.dependencies.hasOwnProperty(plugin)) {
        // Require
        const pluginJSON = require(join(PLUGIN_LOCATION, plugin, "package.json"));
        // ...and store
        this.props.dispatch(addPlugin(pluginJSON));
      }
    }
  }

  /**
   * @function renders the layout
   */
  renderLayout() {
    // Init layout
    /**
     * Children function
     * @description Reurns children to render (panels)
     * @param layout {Object} Layout config
     * @param type {String} Type of split
     * @return {Object}
     * @return children {Object} Children of panel
     * @return params {Object} Params for panel
     */
    const children = (layout, type) => {
      console.log(layout);
      if (layout.hasOwnProperty("vertical") || layout.hasOwnProperty("horizontal")) {
        // Resplit as we have a panel that needs splitting
        return { layout, children: getSplit(children, layout) };
      } else if (layout.hasOwnProperty("module")) {
        // Get module as children
        return { params: layout, children: (<h1>Module needed: {layout.module}</h1>) };
        // return (<Module name={layout.module} />)
      } else {
        // Right or left logic here
        return {
          params: layout.left,
          children: [
            children(layout.left.contents).children,
            children(layout.right.contents).children
          ].map(element => <div>{element}</div>),
          // What to do if size changes
          onSizeChange: (size) => {
            this.props.dispatch(updateLayoutConfig({
              ...this.props.layout.config,
              vertical: { ...this.props.layout.config.vertical,
                left: { ...this.props.layout.config.vertical.left,
                  width: size
                }
              }
            }));
          }
        };
      }
    };

    /**
     * Gets split to do
     * @param children {Function} Function that returns what to put in panel
     * @param config {Object} Layout config
     */
    const getSplit = (children, config) => {
      if (config.hasOwnProperty("vertical")) {
        const renderedParams = children(config.vertical, "vertical");
        return (<Panel direction="vertical" params={renderedParams.params} onSizeChange={renderedParams.onSizeChange}>{renderedParams.children}</Panel>);
      } else if (config.hasOwnProperty("horizontal")) {
        const renderedParams = children(config.vertical, "horizontal");
        return (<Panel direction="horizontal" params={renderedParams.params} onSizeChange={renderedParams.onSizeChange}>{renderedParams.children}</Panel>);
      } else {
        const renderedParams = children(config, null);
        return (renderedParams.children);
      }
    };

    // Render
    const render = getSplit(children, this.props.layout.config);
    // Dispatch
    this.props.dispatch(updateLayoutRender(render));
  }

  render() {
    return (
      <div>
        { createFragment(this.props.layout.rendered) }
      </div>
    );
  }
}

Tara.propTypes = {
  dispatch: PropTypes.func.isRequired,
  layout: PropTypes.object.isRequired
};

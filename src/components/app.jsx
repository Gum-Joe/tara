/**
 * @overview Tara's main react entry point for components
 * Sets up layout
 */
import React, { Component } from "react";
import createFragment from "react-addons-create-fragment";
import { join } from "path";
import PropTypes from "prop-types";
import jquery from "jquery";
import Panel from "./panel";
import { updateLayoutConfig, updateLayoutRender, addPlugin } from "../actions";
import Module from "./module";
import { PLUGIN_CONFIG, PLUGIN_LOCATION } from "../packages/tara-core/src/constants";
import Theme from "../containers/theme";

const requireFoolWebpack = require("require-fool-webpack");

// Plugin config file
const plugins = requireFoolWebpack(PLUGIN_CONFIG);

/**
 * Tara entry point
 */
export default class Tara extends Component {
  componentDidMount() {
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
        const pluginJSON = requireFoolWebpack(join(PLUGIN_LOCATION, plugin, "package.json"));
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
     * @param {Object} layout Layout config
     * @param {String} type Type of split
     * @returns {Object}
     * @returns {Object} children Children of panel
     * @returns {Object} params Params for panel
     */
    const children = (layout, type) => {
      if (layout.hasOwnProperty("vertical") || layout.hasOwnProperty("horizontal")) {
        // Resplit as we have a panel that needs splitting
        return { layout, children: getSplit(children, layout) };
      } else if (layout.hasOwnProperty("module")) {
        // Get module as children
        return { params: layout, children: (<Module module={layout.module} />) };
        // return (<Module name={layout.module} />)
      } else if (layout.hasOwnProperty("left") || layout.hasOwnProperty("right")) {
        // Right or left logic here, as layout is vertical
        return {
          params: layout.left,
          children: [
            children(layout.left.contents || layout.left).children,
            children(layout.right.contents || layout.right).children
          ].map(element => <div>{element}</div>)
          // What to do if size changes
          /*onSizeChange: (size) => {
            this.props.dispatch(updateLayoutConfig({
              ...this.props.layout.config,
              vertical: { ...this.props.layout.config.vertical,
                left: { ...this.props.layout.config.vertical.left,
                  width: size
                }
              }
            }));
          }*/
        };
      } else if (layout.hasOwnProperty("up") || layout.hasOwnProperty("down")) {
        // Up or down logic here, as layout is horizontal
        return {
          params: layout.up,
          children: [
            children(layout.up.contents || layout.up).children,
            children(layout.down.contents || layout.down).children
          ].map(element => <div>{element}</div>)
          // What to do if size changes
          /*onSizeChange: (size) => {
            this.props.dispatch(updateLayoutConfig({
              ...this.props.layout.config,
              horizontal: { ...this.props.layout.config.horizontal,
                up: { ...this.props.layout.config.horizontal.up,
                  height: size
                }
              }
            }));
          }*/
        };
      }
    };

    /**
     * Gets split to do
     * @param {Function} children Function that returns what to put in panel
     * @param {Object} config Layout config
     * @returns {Object} Panel JSX or the children of the panel
     */
    const getSplit = (children, config) => {
      if (config.hasOwnProperty("vertical")) {
        const renderedParams = children(config.vertical, "vertical");
        return (<Panel direction="vertical" params={renderedParams.params} onSizeChange={renderedParams.onSizeChange}>{renderedParams.children}</Panel>);
      } else if (config.hasOwnProperty("horizontal")) {
        const renderedParams = children(config.horizontal, "horizontal");
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
      <Theme>
        <div>
          { createFragment(this.props.layout.rendered) }
        </div>
      </Theme>
    );
  }
}

Tara.propTypes = {
  dispatch: PropTypes.func.isRequired,
  layout: PropTypes.object.isRequired
};

/**
 * @overview Tara's main react entry point for components
 */
import React, { Component } from "react";
import createFragment from "react-addons-create-fragment";
import PropTypes from "prop-types";
import Panel from "./panel";
import { updateLayoutRender } from "../actions";

/**
 * @overview Tara entry points
 */
export default class Tara extends Component {
  componentDidMount() {
    // Init layout
    /**
     * @overview Children function
     * @description Reurns children to render (panels)
     * @param layout {Object} Layout config
     * @param type {String} Type of split
     * @return {Object}
     * @return children {Object} Children of panel
     * @return params {Object} Params for panel
     */
    const children = (layout, type) => {
      if (layout.hasOwnProperty("vertical") || layout.hasOwnProperty("horizontal")) {
        // Resplit as we have a panel that needs splitting
        return { layout, children: this.getSplit(children, layout) };
      } else if (layout.hasOwnProperty("module")) {
        // Get module as children
        return { params: layout.module, children: (<h1>Module needed: {layout.module}</h1>) };
        // return (<Module name={layout.module} />)
      } else {
        // Right or left logic here
        return {
          params: layout.left,
          children: [
            children(layout.left.contents).children,
            children(layout.right.contents).children
          ].map(element => <div>{element}</div>)
        };
      }
    };
    const render = this.getSplit(children, this.props.layout.config);
    // Dispatch
    this.props.dispatch(updateLayoutRender(render));
  }

  /**
   * @overview Gets split to do
   * @param children {Function} Function that returns what to put in panel
   * @param config {Object} Layout config
   */
  getSplit(children, config) {
    if (config.hasOwnProperty("vertical")) {
      const renderedParams = children(config.vertical, "vertical");
      return (<Panel direction="vertical" params={renderedParams.params}>{renderedParams.children}</Panel>);
    } else {
      const renderedParams = children(config.vertical, "horizontal");
      return (<Panel direction="horizontal" params={renderedParams.params}>{renderedParams.children}</Panel>);
    }
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

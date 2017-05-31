/**
 * @overview Entry Point for tara's explorer (windows)
 * @module explorer
 */
import React, { Component } from "react";
import { HashRouter as Router, Route, Redirect, Switch } from "react-router-dom";
import { Provider } from "react-redux";
import PropTypes from "prop-types";
import { DefaultPage, HomeDir } from "./pages";
import ShowDir from "../containers/show-dir";

// Export
export default class Explorer extends Component {
  componentDidMount() {
    const tara = global.tara;
    tara.getPlugin("tara-explorer")
      .then(api => tara.addEventListener("explorer", api.constants.TARA_UPDATE_DIR, (event, dir) => {
        console.log("chdir");
        console.log(dir);
      }));
  }
  render() {
    return (
      <Router basename="/explorer">
        <div>
          <Route path="/">
            <Redirect to="/default-page" />
          </Route>
          <Switch>
            <Route path="/default-page"><DefaultPage /></Route>
            <Route path="/dir/home"><HomeDir /></Route>
            <Route path="/dir/:dir" component={ShowDir} />
          </Switch>
        </div>
      </Router>
    );
  }
}

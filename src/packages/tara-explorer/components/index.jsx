/**
 * @overview Entry Point for tara's explorer (windows)
 * @module explorer
 */
import React, { Component } from "react";
import { HashRouter as Router, Route, Redirect, Switch } from "react-router-dom";
import { Provider } from "react-redux";
import { DefaultPage, HomeDir } from "./pages";
import ShowDir from "./show-dir";

// Export
export default class Explorer extends Component {
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

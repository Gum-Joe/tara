/**
 * @overview Entry Point for tara's explorer (windows)
 * @module explorer
 */
import React, { Component } from "react";
import { HashRouter as Router, Route, Redirect, Switch } from "react-router-dom";
import { syncHistoryWithStore } from "react-router-redux";
import { Provider } from "react-redux";
import PropTypes from "prop-types";
import createHistory from "history/createHashHistory";
import { DefaultPage, HomeDir } from "./pages";
import Browser from "./browser";

// Store
const history = syncHistoryWithStore(createHistory(), global.store);
global.explorerHistory = history;

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
      <Router basename="/explorer" history={history}>
        <div>
          <Route path="/">
            <Redirect push to="/default-page" />
          </Route>
          <Switch>
            <Route path="/default-page"><DefaultPage /></Route>
            { /* <Route path="/dir/home"><HomeDir /></Route> */ }
            <Route path="/dir/:dir" component={Browser} />
          </Switch>
        </div>
      </Router>
    );
  }
}

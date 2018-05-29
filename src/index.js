/**
 * @overview React entry point
 */
// Polyfills
import "@babel/polyfill";
import "jquery/dist/jquery.min";
// import "bootstrap/dist/js/bootstrap.min.js";


// From electron-compile README.md
import React from "react";
import ReactDOM from "react-dom";
import { AppContainer } from "react-hot-loader";
import { Provider } from "react-redux";
import { createStore } from "redux";
import "font-awesome/css/font-awesome.min.css";
import reducers from "./reducers"; // eslint-disable-line
import { App } from "./containers/app";
import { loadScripts } from "./packages/tara-core";

// Styles inc. semantic UI
import "./semantic/dist/semantic.min.css";
import "./css/index.scss";

// Add global tara object
import Tara from "./packages/tara-core/src/plugin-init"; // eslint-disable-line
global.tara = Tara;

const store = createStore(
  reducers,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__() // Redux dev tools
);

// Keep global reference
global.store = store;

// Load scripts
loadScripts();

const render = Component => {
  // NB: We have to re-require MyApp every time or else this won't work
  // We also need to wrap our app in the AppContainer class
  // eslint-disable-next-line
  ReactDOM.render(
    <AppContainer>
      <Provider store={store}><Component /></Provider>
    </AppContainer>
    , document.getElementById("app"));
};

render(App);
if (module.hot) {
  module.hot.accept("./containers/app.jsx", () => render(App));
}

/**
 * @overview React entry point
 */
// From electron-compile README.md
import React from "react";
import ReactDOM from "react-dom";
import { AppContainer } from "react-hot-loader";

const render = () => {
  // NB: We have to re-require MyApp every time or else this won't work
  // We also need to wrap our app in the AppContainer class
  const { Tara } = require("../components/index.jsx");
  ReactDOM.render(<AppContainer><Tara /></AppContainer>, document.getElementById("main"));
};

render();
if (module.hot) { module.hot.accept(render); }

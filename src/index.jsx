/**
 * @overview React entry point
 */
// Polyfill
import "babel-polyfill";

// From electron-compile README.md
import React from "react";
import ReactDOM from "react-dom";
import { AppContainer } from "react-hot-loader";
import { Provider } from "react-redux";
import { createStore } from "redux";
import reducers from "../reducers"; // eslint-disable-line

const store = createStore(
  reducers,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__() // Redux dev tools
);

const render = () => {
  // NB: We have to re-require MyApp every time or else this won't work
  // We also need to wrap our app in the AppContainer class
  // eslint-disable-next-line
  const { App } = require("../containers/app.jsx"); // This has to be like this as it is required in ./renderer
  ReactDOM.render(
    <AppContainer>
      <Provider store={store}><App /></Provider>
    </AppContainer>
  , document.getElementById("main"));
};

render();
if (module.hot) { module.hot.accept(render); }

/**
 * @overview Entry point for file operations JSX
 */
import React, { Component } from "react";
import ReactDOM from "react-dom";
import { AppContainer } from "react-hot-loader";

class FileOps extends Component {
  render() {
    return (
      <h1>Copying files...</h1>
    )
  }
}

const render = () => {
  // NB: We have to re-require every time or else this won't work
  // We also need to wrap our app in the AppContainer class
  // eslint-disable-next-line
  ReactDOM.render(
    <FileOps />
  , document.getElementById("main"));
};

render();
if (module.hot) { module.hot.accept(render); }

/**
 * @overview Entry point for file operations JSX
 */
import React, { Component } from "react";
import ReactDOM from "react-dom";
import { AppContainer } from "react-hot-loader";
import Header from "../src/components/header";
import Progress from "../src/components/progress";

class FileOps extends Component {
  render() {
    return (
      <div id="tara-file-operations">
        <Progress />
      </div>
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

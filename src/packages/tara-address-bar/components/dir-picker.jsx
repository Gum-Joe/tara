import React, { Component } from "react";
import PropTypes from "prop-types";
import { Input, Button } from "semantic-ui-react";

export default class DirPicker extends Component {
  constructor() {
    super();
    this.state = {
      changeTo: null
    };
  }
  render() {
    return (
      <Input
        action={
          <Button
            className="address-bar-button"
            content="Go"
            icon="arrow right"
            labelPosition="right"
            onClick={(event, data) => {
              if (this.state.changeTo) {
                this.props.setDir(this.state.changeTo);
              }
            }}
          />
        }
        className="address-bar-picker"
        placeholder={this.props.dir}
        defaultValue={this.props.dir}
        onChange={(event, data) => this.setState({ changeTo: data.value })}
      />
    );
  }
}

DirPicker.propTypes = {
  dir: PropTypes.string.isRequired,
  setDir: PropTypes.func.isRequired
};

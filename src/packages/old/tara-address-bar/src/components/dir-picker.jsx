import React, { Component } from "react";
import jquery from "jquery";
import PropTypes from "prop-types";
import { Input, Button } from "semantic-ui-react";

export default class DirPicker extends Component {
  constructor(props) {
    super(props);
    this.state = {
      changeTo: props.dir,
      urlPicked: false
    };
    this.handleClick = this.handleClick.bind(this);
  }
  componentDidMount() {
    // Handle enter
    jquery(document).keypress((event) => {
      if (event.which === 13) {
        // enter pressed
        this.handleClick();
      }
    });

    // Handle off click
    const offClickListener = (event) => {
      if (!event.target.parentElement.className.includes("address-bar-picker") && !event.target.parentElement.className.includes("address-bar-button")) {
        // Off clicked
        document.body.removeEventListener("click", offClickListener, true);
        this.handleClick();
      }
    };
    document.body.addEventListener("click", offClickListener, true);
  }
  /**
   * Handle clicking of button/enter
   * @returns {undefined} Nothing
   */
  handleClick() {
    if (this.state.changeTo) {
      //this.setState({
      //  ...this.state,
      //  urlPicked: true
      //});
      this.props.setDir(this.state.changeTo);
    }
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
            onClick={this.handleClick}
          />
        }
        className="address-bar-picker"
        placeholder={this.props.dir}
        defaultValue={this.props.dir}
        onChange={(event, data) => this.setState({ ...this.state, changeTo: data.value })}
      />
    );
  }
}

DirPicker.propTypes = {
  dir: PropTypes.string.isRequired,
  setDir: PropTypes.func.isRequired
};

import React, { Component } from 'react';
import PropTypes from "prop-types";
import jquery from "jquery";
import { Input, Icon, Button } from "semantic-ui-react";
import { updateDir as chdir } from "../actions";

export default class AddressBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      display: true,
      newDir: props.dir,
    };
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
        this.setState({
          ...this.state,
          display: true,
          newDir: this.props.dir,
        });
      }
    };
    document.body.addEventListener("click", offClickListener, true);
  }
  /**
   * Handles click event
   * @returns {void}
   */
  handleClick() {
    this.props.dispatch(chdir(this.state.newDir));
    this.setState({ ...this.state, display: true });
    global.explorerRefresh(this.state.newDir); // Refresh explorer
  }
  render() {
    return (
      <div className="tara-address-bar-new">
        {
          this.state.display ?
            <h2 onClick={() => this.setState({ ...this.state, display: false })}>{this.props.dir}</h2>
            :
            <div className="tara-address-bar">
              <Input
                action={
                  <Button
                    icon
                    className="address-bar-button"
                    onClick={this.handleClick.bind(this)}>
                    <Icon name="arrow right" />
                  </Button>
                }
                className="address-bar-picker"
                placeholder={this.props.dir}
                defaultValue={this.props.dir}
                onChange={(event, data) => this.setState({ ...this.state, newDir: data.value })}
              />
            </div>
        }
      </div>
    );
  }
}

AddressBar.propTypes = {
  dir: PropTypes.string.isRequired,
  dispatch: PropTypes.func.isRequired
};
import React, { Component } from 'react'

export default class AddressBar extends Component {
  render() {
    return (
      <div className="tara-address-bar-new">
        <h2>{this.props.dir}</h2>
      </div>
    )
  }
}
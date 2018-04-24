/**
 * @overview Container of address bar
 */
import React, { Component } from "react";
import { connect } from "react-redux";
import AddressBar from "../components/index";

const mapStateToProps = (state) => {
  return state;
};

const App = connect(mapStateToProps)(AddressBar);

export default connect(mapStateToProps)(AddressBar);

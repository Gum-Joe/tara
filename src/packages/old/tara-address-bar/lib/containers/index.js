"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _reactRedux = require("react-redux");

var _index = require("../components/index");

var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var mapStateToProps = function mapStateToProps(state) {
  return state;
}; /**
    * @overview Container of address bar
    */


var App = (0, _reactRedux.connect)(mapStateToProps)(_index2.default);

exports.default = (0, _reactRedux.connect)(mapStateToProps)(_index2.default);
//# sourceMappingURL=index.js.map
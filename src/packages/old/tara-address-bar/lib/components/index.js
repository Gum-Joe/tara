"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _reactFontawesome = require("react-fontawesome");

var _reactFontawesome2 = _interopRequireDefault(_reactFontawesome);

var _jquery = require("jquery");

var _jquery2 = _interopRequireDefault(_jquery);

var _propTypes = require("prop-types");

var _propTypes2 = _interopRequireDefault(_propTypes);

var _dirPicker = require("./dir-picker");

var _dirPicker2 = _interopRequireDefault(_dirPicker);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @overview tara-address-bar windows entry point
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @module address-bar
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */


var TaraAddressBar = function (_Component) {
  _inherits(TaraAddressBar, _Component);

  function TaraAddressBar(props) {
    _classCallCheck(this, TaraAddressBar);

    var _this = _possibleConstructorReturn(this, (TaraAddressBar.__proto__ || Object.getPrototypeOf(TaraAddressBar)).call(this, props));

    _this.state = {
      picker: null
    };
    _this.handleDirClick = _this.handleDirClick.bind(_this);
    _this.changeDir = _this.changeDir.bind(_this);
    return _this;
  }

  _createClass(TaraAddressBar, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      var _this2 = this;

      // Handle action click
      (0, _jquery2.default)(".tara-address-bar .fa-arrow-left").click(function () {
        global.explorerHistory.goBack();
        global.explorerGenReactGrid(global.explorerHistory.location.pathname.splice(15));
        _this2.props.tara.getPlugin("tara-explorer").then(function (explorer) {
          return _this2.props.dispatch(explorer.actions.updateDir(global.explorerHistory.location.pathname.splice(15)));
        });
      });
      (0, _jquery2.default)(".tara-address-bar .fa-arrow-right").click(function () {
        global.explorerHistory.goForward();
        global.explorerGenReactGrid(global.explorerHistory.location.pathname.splice(15));
        _this2.props.tara.getPlugin("tara-explorer").then(function (explorer) {
          return _this2.props.dispatch(explorer.actions.updateDir(global.explorerHistory.location.pathname.splice(15)));
        });
      });
    }
    /**
     * Changes the current dir (for dir picker)
     * @param {String} dir Dir to change to
     * @returns {undefined} Nothing
     */

  }, {
    key: "changeDir",
    value: function changeDir(dir) {
      var _this3 = this;

      console.log("Chdir " + dir + "....");
      this.props.tara.getPlugin("tara-explorer").then(function (explorer) {
        return _this3.props.dispatch(explorer.actions.updateDir(dir));
      });
      global.explorerHistory.push("/explorer/dir/" + dir);
      global.explorerGenReactGrid(dir);
      this.setState({
        picker: null
      });
    }
    /**
     * Handle Dir click to show text box
     * @returns {undefined} Nothing
     */

  }, {
    key: "handleDirClick",
    value: function handleDirClick() {
      this.setState({
        picker: _react2.default.createElement(_dirPicker2.default, { dir: this.props.dir.dir, setDir: this.changeDir })
      });
    }
  }, {
    key: "render",
    value: function render() {
      return _react2.default.createElement(
        "div",
        null,
        _react2.default.createElement(_reactFontawesome2.default, { name: "arrow-left" }),
        _react2.default.createElement(_reactFontawesome2.default, { name: "arrow-right" }),
        this.state.picker === null ? _react2.default.createElement(
          "p",
          { className: "current-dir", onClick: this.handleDirClick },
          this.props.dir.dir
        ) : this.state.picker
      );
    }
  }]);

  return TaraAddressBar;
}(_react.Component);

exports.default = TaraAddressBar;


TaraAddressBar.propTypes = {
  dir: _propTypes2.default.object.isRequired,
  dispatch: _propTypes2.default.func.isRequired,
  tara: _propTypes2.default.object.isRequired
};
//# sourceMappingURL=index.js.map
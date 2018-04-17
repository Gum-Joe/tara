"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _jquery = require("jquery");

var _jquery2 = _interopRequireDefault(_jquery);

var _propTypes = require("prop-types");

var _propTypes2 = _interopRequireDefault(_propTypes);

var _semanticUiReact = require("semantic-ui-react");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var DirPicker = function (_Component) {
  _inherits(DirPicker, _Component);

  function DirPicker(props) {
    _classCallCheck(this, DirPicker);

    var _this = _possibleConstructorReturn(this, (DirPicker.__proto__ || Object.getPrototypeOf(DirPicker)).call(this, props));

    _this.state = {
      changeTo: props.dir,
      urlPicked: false
    };
    _this.handleClick = _this.handleClick.bind(_this);
    return _this;
  }

  _createClass(DirPicker, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      var _this2 = this;

      // Handle enter
      (0, _jquery2.default)(document).keypress(function (event) {
        if (event.which === 13) {
          // enter pressed
          _this2.handleClick();
        }
      });

      // Handle off click
      var offClickListener = function offClickListener(event) {
        if (!event.target.parentElement.className.includes("address-bar-picker") && !event.target.parentElement.className.includes("address-bar-button")) {
          // Off clicked
          document.body.removeEventListener("click", offClickListener, true);
          _this2.handleClick();
        }
      };
      document.body.addEventListener("click", offClickListener, true);
    }
    /**
     * Handle clicking of button/enter
     * @returns {undefined} Nothing
     */

  }, {
    key: "handleClick",
    value: function handleClick() {
      if (this.state.changeTo) {
        //this.setState({
        //  ...this.state,
        //  urlPicked: true
        //});
        this.props.setDir(this.state.changeTo);
      }
    }
  }, {
    key: "render",
    value: function render() {
      var _this3 = this;

      return _react2.default.createElement(_semanticUiReact.Input, {
        action: _react2.default.createElement(_semanticUiReact.Button, {
          className: "address-bar-button",
          content: "Go",
          icon: "arrow right",
          labelPosition: "right",
          onClick: this.handleClick
        }),
        className: "address-bar-picker",
        placeholder: this.props.dir,
        defaultValue: this.props.dir,
        onChange: function onChange(event, data) {
          return _this3.setState(_extends({}, _this3.state, { changeTo: data.value }));
        }
      });
    }
  }]);

  return DirPicker;
}(_react.Component);

exports.default = DirPicker;


DirPicker.propTypes = {
  dir: _propTypes2.default.string.isRequired,
  setDir: _propTypes2.default.func.isRequired
};
//# sourceMappingURL=dir-picker.js.map
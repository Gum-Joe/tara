"use strict";

var _containers = require("./containers");

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var init = function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(tara, done) {
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            // Get a panel
            tara.getPanelByName("explorer")
            // Split
            .then(function (panel) {
              return panel.split({ moveTo: "down", direction: "horizontal" });
            }).catch(function (err) {
              throw err;
            }).then(function (section) {
              return section.loadModule("tara-address-bar");
            }).catch(function (err) {
              throw err;
            }).then(function (section) {
              return section.height(45);
            }) // Set height
            .then(function (section) {
              return section.minHeight(45);
            }) // Set minHeight
            .then(function (section) {
              return section.maxHeight(45);
            }) // Set maxHeight
            .catch(function (err) {
              throw err;
            }).then(function (layout) {
              return done(layout);
            });

          case 1:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, undefined);
  }));

  return function init(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();

var main = function main(tara) {
  // server.start();
};

var client = _containers.App;

module.exports = {
  main: main,
  init: init,
  client: client
};
//# sourceMappingURL=index.js.map
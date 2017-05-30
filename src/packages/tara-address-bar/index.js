// Sample plugin
// Should contain 3 props:
//  init: function to export layout for plugin
//  client: property containing react jsx
//  main: main process function to run on startup
// Can be written in ES6
const init = async (tara, done) => {
  // Get a panel
  tara.getPanelByName("explorer")
    // Split
    .then(panel => panel.split({ moveTo: "down", direction: "horizontal" }))
    .catch((err) => { throw err; })
    .then(section => section.loadModule("tara-address-bar"))
    .catch((err) => { throw err; })
    .then(section => section.height(45)) // Set height#
    .then(section => section.minHeight(45)) // Set minHeight
    .catch((err) => { throw err; })
    .then(layout => done(layout));
};

const main = (tara) => {
  // server.start();
};

module.exports = {
  main,
  init
};

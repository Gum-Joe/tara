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
    .then(panel => panel.split({ moveTo: "right", direction: "vertical" }))
    .catch((err) => { throw err; })
    .then(section => section.loadModule("tara-finder")) // or section.loadModule("tara-testing")
    .catch((err) => { throw err; })
    .then(section => section.width(220)) // Set width
    .catch((err) => { throw err; })
    .then(layout => done(layout));
};

const main = (tara) => {
  // server.start();
};

const client = "<JSX />";

module.exports = {
  client,
  main,
  init
};

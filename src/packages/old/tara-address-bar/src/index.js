import { App } from "./containers";

const init = async (tara, done) => {
  // Get a panel
  tara.getPanelByName("explorer")
    // Split
    .then(panel => panel.split({ moveTo: "down", direction: "horizontal" }))
    .catch((err) => { throw err; })
    .then(section => section.loadModule("tara-address-bar"))
    .catch((err) => { throw err; })
    .then(section => section.height(45)) // Set height
    .then(section => section.minHeight(45)) // Set minHeight
    .then(section => section.maxHeight(45)) // Set maxHeight
    .catch((err) => { throw err; })
    .then(layout => done(layout));
};

const main = (tara) => {
  // server.start();
};

const client = App;

module.exports = {
  main,
  init,
  client
};

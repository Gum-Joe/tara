/**
 * @overview Default layout for tara
 * Should be copied to ~/.tara/layout.js
 */
module.exports = {
  vertical: { // Splits into finder and explorer
    left: {
      name: "finder",
      width: 220, // Left most section
      contents: {
        module: "tara-finder"
      }
    },

    right: {
      name: "explorer",
      contents: {
        module: "explorer"
        // Here you would split it
      }
    }
  }
};

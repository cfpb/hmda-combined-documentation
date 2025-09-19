const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
  env: {
    HOST: 'http://localhost:3000',
  },
  video: false,
  screenshotOnRunFailure: false,
  viewportHeight: 1000,
  viewportWidth: 1025
});
// Karma config
// https://karma-runner.github.io/0.12/config/configuration-file.html
// https://jstools.dev/karma-config/

"use strict";

const { karmaConfig } = require("@jsdevtools/karma-config");
const { host } = require("@jsdevtools/host-environment");

module.exports = karmaConfig({
  sourceDir: "lib",
  fixtures: "test/fixtures/**/*.js",
  browsers: {
    chrome: host.ci ? host.os.linux : true,
    firefox: host.ci ? host.os.linux : true,
    safari: false,
    edge: false,
    ie: false,
    // Find a way to bring back these without using Saucelabs
    // safari: host.ci ? host.os.linux : host.os.mac,
    // edge: host.os.windows,
    // ie: host.ci ? host.os.windows : true,
  },
  config: {
    exclude: [
      // Exclude these tests because some of the APIs are HUGE and cause timeouts.
      // We still test them in Node though.
      "test/specs/real-world/*",
    ],
  },
});

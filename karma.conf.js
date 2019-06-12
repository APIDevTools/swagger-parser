// Karma config
// https://karma-runner.github.io/0.12/config/configuration-file.html
// https://jsdevtools.org/karma-config/

"use strict";
const { karmaConfig } = require("karma-config");
let exclude = [];

exclude.push(
  // Exclude these tests because some of the APIs are HUGE and cause timeouts.
  // We still test them in Node though.
  "test/specs/real-world/*"
);

if (process.env.WINDOWS && process.env.CI) {
  // We're running in a Windows CI/CD environment, so Karma-Config will use SauceLabs.
  // The following tests tend to fail on SauceLabs, probably due to zero-byte files
  // and special characters in the paths. So, exclude them.
  exclude.push(
    "test/specs/invalid/*",
    "test/specs/unknown/*",
    "test/specs/validate-schema/*",
    "test/specs/real-world/*",
  );
}

module.exports = karmaConfig({
  sourceDir: "lib",
  fixtures: "test/fixtures/**/*.js",
  browsers: {
    ie: true,
  },
  config: {
    exclude,
  }
});

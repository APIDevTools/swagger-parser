"use strict";

const { host } = require("@jsdevtools/host-environment");

// Load the Babel Polyfills for old browsers.
// NOTE: It's important that we ONLY do this when needed,
// to ensure that our code works _without_ polyfills everywhere else
if (host.os.windows) {
  require("@babel/polyfill");
}

"use strict";

// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const { host } = require("@jsdevtools/host-environment");

if (host.browser) {
  // @ts-expect-error TS(2304): Cannot find name 'mocha'.
  mocha.setup("bdd");
  // @ts-expect-error TS(2304): Cannot find name 'mocha'.
  mocha.fullTrace();
  // @ts-expect-error TS(2304): Cannot find name 'mocha'.
  mocha.asyncOnly();
  // @ts-expect-error TS(2304): Cannot find name 'mocha'.
  mocha.checkLeaks();
  // @ts-expect-error TS(2304): Cannot find name 'mocha'.
  mocha.globals(["$0", "$1", "$2", "$3", "$4", "$5", "ga", "gaplugins", "gaGlobal", "gaData"]);
}

// @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
beforeEach(function(this: any) {
  // Most of our tests perform multiple AJAX requests,
  // so we need to increase the timeouts to allow for that
  this.currentTest.timeout(20000);
  this.currentTest.slow(10000);
});

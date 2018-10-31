// Mocha configuration
(function () {
  "use strict";

  if (host.browser) {
    mocha.setup("bdd");
    mocha.fullTrace();
    mocha.asyncOnly();
    mocha.checkLeaks();
    mocha.globals(["$0", "$1", "$2", "$3", "$4", "$5", "ga", "gaplugins", "gaGlobal", "gaData"]);
  }

  beforeEach(function () {
    // Most of our tests perform multiple AJAX requests,
    // so we need to increase the timeouts to allow for that
    this.currentTest.timeout(10000);
    this.currentTest.slow(5000);
  });

}());

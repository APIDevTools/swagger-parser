(function() {
  'use strict';

  global.helper = {
    cloneDeep: cloneDeep,
    testsDir: getTestsDir(),
    relPath: relPath,
    absPath: absPath
  };

  /**
   * Deep-clones an object or array
   */
  function cloneDeep(obj) {
    var clone = obj;
    if (obj && typeof(obj) === 'object') {
      clone = obj instanceof Array ? [] : {};
      var keys = Object.keys(obj);
      for (var i = 0; i < keys.length; i++) {
        clone[keys[i]] = env.cloneDeep(obj[keys[i]]);
      }
    }
    return clone;
  }

  /**
   * Returns the relative path of a file in the "tests/files" directory
   *
   * NOTE: When running in a test-runner (such as Karma) the absolute path is returned instead
   */
  function relPath(file) {
    if (userAgent.isNode) {
      // Return the relative path from the project root
      return path.join('tests', 'files', file);
    }

    // Encode special characters in paths when running in a browser
    file = encodeURIComponent(file).split('%2F').join('/');

    if (window.location.href.indexOf(helper.testsDir) === 0) {
      // Return the relative path from "/tests/index.html"
      return 'files/' + file;
    }

    // We're running in a test-runner (such as Karma), so return an absolute path,
    // since we don't know the relative path of the "files" directory.
    return helper.testsDir.replace(/^https?:\/\/[^\/]+(\/.*)/, '$1files/' + file);
  }

  /**
   * Returns the absolute path of a file in the "tests/files" directory
   */
  function absPath(file) {
    if (userAgent.isNode) {
      return path.join(__dirname, 'files', file || '/');
    }
    else {
      return helper.testsDir + 'files/' + file;
    }
  }

  /**
   * Returns the path of the "tests" directory
   */
  function getTestsDir() {
    if (userAgent.isNode) {
      return path.resolve('tests');
    }

    var __filename = document.querySelector('script[src*="fixtures/helper.js"]').src;
    return __filename.substr(0, __filename.indexOf('fixtures/helper.js'));
  }

})();

(function () {
  'use strict';

  var path = global.path = {};
  var _path = userAgent.isNode ? require('path') : null;
  var _url = userAgent.isNode ? require('url') : null;
  var _testsDir = getTestsDir();

  if (userAgent.isNode) {
    // Run all tests from the "test" directory
    process.chdir(_path.join(__dirname, '..'));
  }

  /**
   * Returns the relative path of a file in the "test" directory
   *
   * NOTE: When running in a test-runner (such as Karma) the absolute path is returned instead
   */
  path.rel = function (file) {
    if (userAgent.isNode) {
      // Return the relative path from the project root
      return _path.normalize(file);
    }

    // Encode special characters in paths when running in a browser
    file = encodeFile(file);

    if (window.location.href.indexOf(_testsDir) === 0) {
      // Return the relative path from "/test/index.html"
      return file;
    }

    // We're running in a test-runner (such as Karma), so return an absolute path,
    // since we don't know the relative path of the "test" directory.
    return _testsDir.replace(/^https?:\/\/[^\/]+(\/.*)/, '$1' + file);
  };

  /**
   * Returns the absolute path of a file in the "test" directory
   */
  path.abs = function (file) {
    if (userAgent.isNode) {
      file = _path.join(_testsDir, file || '/');
    }
    else {
      file = _testsDir + encodeFile(file);
    }
    if (/^[A-Z]\:[\\\/]/.test(file)) {
      // lowercase the drive letter on Windows, for string comparison purposes
      file = file[0].toLowerCase() + file.substr(1);
    }
    return file;
  };

  /**
   * Returns the path of a file in the "test" directory as a URL.
   */
  path.url = function (file) {
    if (userAgent.isBrowser) {
      // In browsers, just return the absolute URL (e.g. "http://localhost/test/files/...")
      return path.abs(file);
    }

    // In Node, return the absolute path as a URL (e.g. "file://path/to/json-schema-ref-parser/test/files...")
    var pathname = path.abs(file);
    if (/^win/.test(process.platform)) {
      pathname = pathname.replace(/\\/g, '/');  // Convert Windows separators to URL separators
    }
    var url = _url.format({
      protocol: 'file:',
      slashes: true,
      pathname: pathname
    });

    return url;
  };

  /**
   * Returns the path of the current working directory.
   * In Node, this is the "test" directory. In the browser, it is the directory of the current page.
   */
  path.cwd = function () {
    if (userAgent.isNode) {
      return process.cwd() + '/';
    }
    else {
      return location.href;
    }
  };

  /**
   * Returns the path of the "test" directory
   */
  function getTestsDir () {
    if (userAgent.isNode) {
      return _path.resolve(__dirname, '..');
    }
    else {
      var filename = document.querySelector('script[src*="fixtures/path.js"]').src;
      return filename.substr(0, filename.indexOf('fixtures/path.js'));
    }
  }

  /**
   * URI-encodes the given file name
   */
  function encodeFile (file) {
    return encodeURIComponent(file).split('%2F').join('/');
  }

}());

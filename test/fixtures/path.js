(function () {
  'use strict';

  var path;
  if (host.node) {
    path = filesystemPathHelpers();
  }
  else {
    path = urlPathHelpers();
  }

  host.global.path = path;

  /**
   * Helper functions for getting local filesystem paths in various formats
   */
  function filesystemPathHelpers () {
    var _path = host.node ? require('path') : null;
    var _url = host.node ? require('url') : null;
    var _testsDir = _path.resolve(__dirname, '..');
    var _isWindows = /^win/.test(process.platform);

    // Run all tests from the "test" directory
    process.chdir(_path.join(__dirname, '..'));

    return {
      /**
       * Returns the relative path of a file in the "test" directory
       */
      rel: function (file) {
        return _path.normalize(file);
      },

      /**
       * Returns the absolute path of a file in the "test" directory
       */
      abs: function (file) {
        file = _path.join(_testsDir, file || _path.sep);
        return file;
      },

      /**
       * Returns the path of a file in the "test" directory as a URL.
       * (e.g. "file://path/to/json-schema-ref-parser/test/files...")
       */
      url: function (file) {
        var pathname = path.abs(file);

        if (_isWindows) {
          pathname = pathname.replace(/\\/g, '/');  // Convert Windows separators to URL separators
        }

        var url = _url.format({
          protocol: 'file:',
          slashes: true,
          pathname: pathname
        });

        return url;
      },

      /**
       * Returns the absolute path of the current working directory.
       */
      cwd: function () {
        return _path.join(process.cwd(), _path.sep);
      }
    };
  }

  /**
   * Helper functions for getting URLs in various formats
   */
  function urlPathHelpers () {
    // Get the URL of the "test" directory
    var filename = document.querySelector('script[src*="fixtures/path.js"]').src;
    var _testsDir = filename.substr(0, filename.indexOf('fixtures/path.js'));

    /**
     * URI-encodes the given file name
     */
    function encodePath (file) {
      return encodeURIComponent(file).split('%2F').join('/');
    }

    return {
      /**
       * Returns the relative path of a file in the "test" directory
       *
       * NOTE: When running in Karma the absolute path is returned instead
       */
      rel: function (file) {
        // Encode special characters in paths
        file = encodePath(file);

        if (window.location.href.indexOf(_testsDir) === 0) {
          // We're running from the "/test/index.html" page, directly in a browser.
          // So return the relative path from the "test" directory.
          return file;
        }
        else {
          // We're running in Karma, so return an absolute path,
          // since we don't know the relative path of the "test" directory.
          return _testsDir.replace(/^https?:\/\/[^\/]+(\/.*)/, '$1' + file);
        }
      },

      /**
       * Returns the absolute path of a file in the "test" directory
       */
      abs: function (file) {
        return _testsDir + encodePath(file);
      },

      /**
       * Returns the path of a file in the "test" directory as an absolute URL.
       * (e.g. "http://localhost/test/files/...")
       */
      url: function (file) {
        return path.abs(file);
      },

      /**
       * Returns the path of the current page.
       */
      cwd: function () {
        return location.href;
      }
    };
  }

}());

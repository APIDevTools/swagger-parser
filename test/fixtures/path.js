(function () {
  "use strict";

  let path;
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
    let _path = host.node ? require("path") : null;
    let _url = host.node ? require("url") : null;
    let _testsDir = _path.resolve(__dirname, "..");
    let _isWindows = /^win/.test(process.platform);

    // Run all tests from the "test" directory
    process.chdir(_path.join(__dirname, ".."));

    return {
      /**
       * Returns the relative path of a file in the "test" directory
       */
      rel (file) {
        return _path.normalize(file);
      },

      /**
       * Returns the absolute path of a file in the "test" directory
       */
      abs (file) {
        file = _path.join(_testsDir, file || _path.sep);
        return file;
      },

      /**
       * Returns the path of a file in the "test" directory as a URL.
       * (e.g. "file://path/to/json-schema-ref-parser/test/files...")
       */
      url (file) {
        let pathname = path.abs(file);

        if (_isWindows) {
          pathname = pathname.replace(/\\/g, "/");  // Convert Windows separators to URL separators
        }

        let url = _url.format({
          protocol: "file:",
          slashes: true,
          pathname
        });

        return url;
      },

      /**
       * Returns the absolute path of the current working directory.
       */
      cwd () {
        return _path.join(process.cwd(), _path.sep);
      }
    };
  }

  /**
   * Helper functions for getting URLs in various formats
   */
  function urlPathHelpers () {
    // Get the URL of the "test" directory
    let filename = document.querySelector('script[src*="fixtures/path.js"]').src;
    let _testsDir = filename.substr(0, filename.indexOf("fixtures/path.js"));

    /**
     * URI-encodes the given file name
     */
    function encodePath (file) {
      return encodeURIComponent(file).split("%2F").join("/");
    }

    return {
      /**
       * Returns the relative path of a file in the "test" directory
       *
       * NOTE: When running in Karma the absolute path is returned instead
       */
      rel (file) {
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
          return _testsDir.replace(/^https?:\/\/[^\/]+(\/.*)/, "$1" + file);
        }
      },

      /**
       * Returns the absolute path of a file in the "test" directory
       */
      abs (file) {
        return _testsDir + encodePath(file);
      },

      /**
       * Returns the path of a file in the "test" directory as an absolute URL.
       * (e.g. "http://localhost/test/files/...")
       */
      url (file) {
        return path.abs(file);
      },

      /**
       * Returns the path of the current page.
       */
      cwd () {
        return location.href;
      }
    };
  }

}());

"use strict";

const { host } = require("@jsdevtools/host-environment");

if (host.node) {
  module.exports = filesystemPathHelpers();
}
else {
  module.exports = urlPathHelpers();
}

/**
 * Helper functions for getting local filesystem paths in various formats
 */
function filesystemPathHelpers () {
  let nodePath = host.node ? require("path") : null;
  let nodeUrl = host.node ? require("url") : null;
  let testsDir = nodePath.resolve(__dirname, "..");
  let isWindows = /^win/.test(process.platform);

  // Run all tests from the "test" directory
  process.chdir(nodePath.join(__dirname, ".."));

  const path = {
    /**
     * Returns the relative path of a file in the "test" directory
     */
    rel (file) {
      return nodePath.normalize(file);
    },

    /**
     * Returns the absolute path of a file in the "test" directory
     */
    abs (file) {
      file = nodePath.join(testsDir, file || nodePath.sep);
      return file;
    },

    /**
     * Returns the path of a file in the "test" directory as a URL.
     * (e.g. "file://path/to/json-schema-ref-parser/test/files...")
     */
    url (file) {
      let pathname = path.abs(file);

      if (isWindows) {
        pathname = pathname.replace(/\\/g, "/");  // Convert Windows separators to URL separators
      }

      let url = nodeUrl.format({
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
      return nodePath.join(process.cwd(), nodePath.sep);
    }
  };

  return path;
}

/**
 * Helper functions for getting URLs in various formats
 */
function urlPathHelpers () {
  // Get the URL of the "test" directory
  let filename = document.querySelector('script[src*="/fixtures/"]').src;
  let testsDir = filename.substr(0, filename.indexOf("/fixtures/")) + "/";

  /**
   * URI-encodes the given file name
   */
  function encodePath (file) {
    return encodeURIComponent(file).split("%2F").join("/");
  }

  const path = {
    /**
     * Returns the relative path of a file in the "test" directory
     *
     * NOTE: When running in Karma the absolute path is returned instead
     */
    rel (file) {
      // Encode special characters in paths
      file = encodePath(file);

      if (window.location.href.indexOf(testsDir) === 0) {
        // We're running from the "/test/index.html" page, directly in a browser.
        // So return the relative path from the "test" directory.
        return file;
      }
      else {
        // We're running in Karma, so return an absolute path,
        // since we don't know the relative path of the "test" directory.
        return testsDir.replace(/^https?:\/\/[^\/]+(\/.*)/, "$1" + file);
      }
    },

    /**
     * Returns the absolute path of a file in the "test" directory
     */
    abs (file) {
      return testsDir + encodePath(file);
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

  return path;
}

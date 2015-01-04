(function() {
  'use strict';

  var gulp = require('gulp');
  var sourcemaps = require('gulp-sourcemaps');
  var rename = require('gulp-rename');
  var uglify = require('gulp-uglify');
  var source = require('vinyl-source-stream');
  var buffer = require('vinyl-buffer');
  var browserify = require('browserify');


  gulp.task('default', ['build']);


  /**
   * Bundles and minifies the code for browsers.
   */
  gulp.task('build', ['browserify', 'uglify']);


  /**
   * Builds the following files:
   *  - dist/swagger-parser.js
   *  - dist/swagger-parser.js.map
   */
  gulp.task('browserify', function() {
    return getBrowserifyStream()
      .pipe(sourcemaps.write('./', {sourceRoot: '../'}))
      .pipe(gulp.dest('./dist/'));
  });


  /**
   * Builds the following files:
   *  - dist/swagger-parser.min.js
   *  - dist/swagger-parser.min.js.map
   */
  gulp.task('uglify', function() {
    return getBrowserifyStream()
      .pipe(uglify())
      .pipe(rename({extname: '.min.js'}))
      .pipe(sourcemaps.write('./', {sourceRoot: '../'}))
      .pipe(gulp.dest('./dist/'));
  });


  /**
   * Returns the Browserify bundle as a Gulp stream
   */
  function getBrowserifyStream() {
    var bundle = browserify({
      entries: ['./lib/index.js'],
      standalone: 'swagger.parser',
      debug: true
    }).bundle();

    // Convert the Browserify bundle to a buffered vinyl stream, so Gulp can work with it
    return bundle
      .pipe(source('swagger-parser.js'))
      .pipe(buffer())
      .pipe(sourcemaps.init({loadMaps: true}));
  }

})();

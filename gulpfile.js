'use strict';

var gulp       = require('gulp'),
    sourcemaps = require('gulp-sourcemaps'),
    rename     = require('gulp-rename'),
    uglify     = require('gulp-uglify'),
    fs         = require('fs'),
    path       = require('path'),
    source     = require('vinyl-source-stream'),
    buffer     = require('vinyl-buffer'),
    browserify = require('browserify');

// Top-level tasks
gulp.task('default', ['build']);
gulp.task('build', ['browserify', 'uglify']);
gulp.task('update-tests', ['copy-test-deps']);

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

/**
 * Copies unit test dependencies (mocha, chai, sinon) from node_modules to tests/lib.
 */
gulp.task('copy-test-deps', function() {
  var files = [
    'node_modules/mocha/mocha.css',
    'node_modules/mocha/mocha.js',
    'node_modules/chai/chai.js',
    'node_modules/sinon/pkg/sinon.js'
  ];

  files.forEach(function(file) {
    var dest = path.join('tests', 'lib', path.basename(file));
    fs.createReadStream(file).pipe(fs.createWriteStream(dest));
  });
});

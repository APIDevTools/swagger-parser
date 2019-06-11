"use strict";

let form = require("./form"),
    querystring = require("./querystring"),
    dropdowns = require("./dropdowns"),
    editors = require("./editors"),
    samples = require("./samples"),
    parser = require("./parser"),
    analytics = require("./analytics");

$(() => {
  form();
  querystring();
  dropdowns();
  editors();
  samples();
  parser();
  analytics();
});

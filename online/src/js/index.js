"use strict";

const form = require("./form");
const querystring = require("./querystring");
const dropdowns = require("./dropdowns");
const editors = require("./editors");
const samples = require("./samples");
const parser = require("./parser");
const analytics = require("./analytics");

$(() => {
  form();
  querystring();
  dropdowns();
  editors();
  samples();
  parser();
  analytics();
});

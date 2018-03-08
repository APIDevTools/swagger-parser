'use strict';

var form = require('./form'),
    querystring = require('./querystring'),
    dropdowns = require('./dropdowns'),
    editors = require('./editors'),
    parser = require('./parser'),
    analytics = require('./analytics');

$(function () {
  form.init();
  querystring.init();
  dropdowns.init();
  editors.init();
  parser.init();
  analytics.init();
});

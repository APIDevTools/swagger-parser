var form        = require('./form'),
    querystring = require('./querystring'),
    dropdowns   = require('./dropdowns'),
    editors     = require('./editors'),
    parser      = require('./parser');

$(function() {
  form.init();
  querystring.init();
  dropdowns.init();
  editors.init();
  parser.init();
});

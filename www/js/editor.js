/**
 * Initializes the ACE text editors
 */
exports.init = function() {
  var editor = ace.edit('sample-api');
  editor.setTheme('ace/theme/terminal');
  editor.getSession().setMode('ace/mode/yaml');
};

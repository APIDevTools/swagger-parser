#!/usr/bin/env node

var program = require("commander");
var parser = require("../lib");
var package = require('../package.json');

"use strict";

var specFile;
program
  .version(package.version)
  .usage('[options] <swaggerfile ...>')
  .option('-j, --json', 'Do not allow YAML, only JSON')
  .option('-m, --minify', 'Remove pretty formatting (ignores -s)')
  .option('-s, --spaces <n>', 'Number of spaces in prettification (default: 2)', parseInt)
  .option('-nd, --noderef', 'Do not dereference $ref pointers')
  .option('-ne, --noexternal', 'Do not resolve external $ref pointers')
  .option('-nr, --noresolve', 'Do not resolve $ref pointers')
  .option('-ns, --nostrict', 'Do not do strict validation')
  .option('-nv, --novalidate', 'Do not validate schema')
  .action(function(spec) {
    specFile = spec;
  })
  .parse(process.argv);

if (typeof specFile === 'undefined') {
  console.error('Error: Swagger file not specified');
  program.outputHelp();
  process.exit(1);
} else {
  options = {}
  spaces = 2
  if (program.json) {
    options['parseYaml'] = false
  }
  if (program.spaces) {
    spaces = program.spaces;
  }
  if (program.noderef) {
    options['dereference$Refs'] = false
  }
  if (program.noexternal) {
    options['resolveExternal$Refs'] = false
  }
  if (program.noresolve) {
    options['resolve$Refs'] = false
  }
  if (program.nostrict) {
    options['strictValidation'] = false
  }
  if (program.validate) {
    options['validateSchema'] = false
  }
  parser.parse(specFile, options, function(err, api, metadata) {
    if (!err) {
      if (program.minify) {
        console.log(JSON.stringify(api, null, 0));
      } else {
        console.log(JSON.stringify(api, null, spaces));
      }
    } else {
      console.log(err);
    }
  });
}

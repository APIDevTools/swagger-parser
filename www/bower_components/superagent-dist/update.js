var latestVersion = require('latest-version');
var release = require('release-it').execute;
var chalk = require('chalk');

latestVersion('superagent')
  .then(function (version) {
    console.log(chalk.green('Publishing superagent-dist @' + version));
    release({
      increment: version
    });
  })
  .catch(function (error) {
    console.log(chalk.red.bold('Failed to release', error.message));
  });

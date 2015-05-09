require('../../test-environment');

if (env.isNode) {
  var fs   = require('fs'),
      path = require('path');

  // Find all Swagger files, and add them to the env.realWorldFiles array
  findSwaggerFiles(__dirname);

  function findSwaggerFiles(dir) {
    fs.readdirSync(dir).forEach(function(name) {
      var fullName = path.join(dir, name);
      var ext = path.extname(name);
      var stat = fs.statSync(fullName);

      if (stat.isFile() &&
        ['.json', '.yaml', '.yml'].indexOf(ext) >= 0) {
        // This is a Swagger file, so add it
        env.realWorldFiles.push(path.relative(__dirname, fullName));
      }
      else if (stat.isDirectory()) {
        // Recursively process this sub-directory
        findSwaggerFiles(fullName);
      }
    });
  }
}
else {
  // In browsers, just use this hard-coded list of files
  env.realWorldFiles = [
    "google/adexchangebuyer/v1.2/swagger.json",
    "google/adexchangebuyer/v1.3/swagger.json",
    "google/adexchangeseller/v1/swagger.json",
    "google/adexchangeseller/v1.1/swagger.json",
    "google/adexchangeseller/v2.0/swagger.json",
    "google/admin/email_migration_v2/swagger.json",
    "google/admin/reports_v1/swagger.json",
    "google/adsense/v1.2/swagger.json",
    "google/adsense/v1.3/swagger.json",
    "google/adsense/v1.4/swagger.json",
    "google/adsensehost/v4.1/swagger.json",
    "google/analytics/v2.4/swagger.json",
    "google/analytics/v3/swagger.json",
    "google/androidenterprise/v1/swagger.json",
    "google/androidpublisher/v1/swagger.json",
    "google/androidpublisher/v1.1/swagger.json",
    "google/androidpublisher/v2/swagger.json",
    "google/appsactivity/v1/swagger.json",
    "google/appstate/v1/swagger.json",
    "google/audit/v1/swagger.json",
    "google/autoscaler/v1beta2/swagger.json",
    "google/bigquery/v2/swagger.json",
    "google/blogger/v2/swagger.json",
    "google/blogger/v3/swagger.json",
    "google/books/v1/swagger.json",
    "google/calendar/v3/swagger.json",
    "google/civicinfo/v2/swagger.json",
    "google/cloudmonitoring/v2beta2/swagger.json",
    "google/cloudsearch/v1/swagger.json",
    "google/compute/v1/swagger.json",
    "google/computeaccounts/alpha/swagger.json",
    "google/container/v1beta1/swagger.json",
    "google/content/v2/swagger.json",
    "google/coordinate/v1/swagger.json",
    "google/customsearch/v1/swagger.json",
    "google/dataflow/v1b3/swagger.json",
    "google/dataflow/v1beta3/swagger.json",
    "google/datastore/v1beta1/swagger.json",
    "google/datastore/v1beta2/swagger.json",
    "google/deploymentmanager/v2beta1/swagger.json",
    "google/dfareporting/v1/swagger.json",
    "google/dfareporting/v1.1/swagger.json",
    "google/dfareporting/v1.2/swagger.json",
    "google/dfareporting/v1.3/swagger.json",
    "google/dfareporting/v2.0/swagger.json",
    "google/dfareporting/v2.1/swagger.json",
    "google/discovery/v1/swagger.json",
    "google/dns/v1/swagger.json",
    "google/dns/v1beta1/swagger.json",
    "google/doubleclickbidmanager/v1/swagger.json",
    "google/doubleclicksearch/v2/swagger.json",
    "google/drive/v1/swagger.json",
    "google/drive/v2/swagger.json",
    "google/fitness/v1/swagger.json",
    "google/freebase/v1/swagger.json",
    "google/freebase/v1-sandbox/swagger.json",
    "google/freebase/v1sandbox/swagger.json",
    "google/fusiontables/v1/swagger.json",
    "google/fusiontables/v2/swagger.json",
    "google/games/v1/swagger.json",
    "google/gamesConfiguration/v1configuration/swagger.json",
    "google/gamesManagement/v1management/swagger.json",
    "google/gan/v1beta1/swagger.json",
    "google/genomics/v1beta2/swagger.json",
    "google/gmail/v1/swagger.json",
    "google/groupsmigration/v1/swagger.json",
    "google/groupssettings/v1/swagger.json",
    "google/identitytoolkit/v3/swagger.json",
    "google/licensing/v1/swagger.json",
    "google/logging/v1beta3/swagger.json",
    "google/manager/v1beta2/swagger.json",
    "google/mirror/v1/swagger.json",
    "google/oauth2/v1/swagger.json",
    "google/oauth2/v2/swagger.json",
    "google/pagespeedonline/v1/swagger.json",
    "google/pagespeedonline/v2/swagger.json",
    "google/plus/v1/swagger.json",
    "google/plusDomains/v1/swagger.json",
    "google/prediction/v1.2/swagger.json",
    "google/prediction/v1.3/swagger.json",
    "google/prediction/v1.4/swagger.json",
    "google/prediction/v1.5/swagger.json",
    "google/prediction/v1.6/swagger.json",
    "google/qpxExpress/v1/swagger.json",
    "google/replicapool/v1beta1/swagger.json",
    "google/replicapool/v1beta2/swagger.json",
    "google/replicapoolupdater/v1beta1/swagger.json",
    "google/reseller/v1/swagger.json",
    "google/reseller/v1sandbox/swagger.json",
    "google/resourceviews/v1beta1/swagger.json",
    "google/resourceviews/v1beta2/swagger.json",
    "google/siteVerification/v1/swagger.json",
    "google/spectrum/v1explorer/swagger.json",
    "google/sqladmin/v1beta1/swagger.json",
    "google/sqladmin/v1beta3/swagger.json",
    "google/sqladmin/v1beta4/swagger.json",
    "google/storage/v1/swagger.json",
    "google/storage/v1beta1/swagger.json",
    "google/storage/v1beta2/swagger.json",
    "google/tagmanager/v1/swagger.json",
    "google/taskqueue/v1beta1/swagger.json",
    "google/taskqueue/v1beta2/swagger.json",
    "google/tasks/v1/swagger.json",
    "google/translate/v2/swagger.json",
    "google/urlshortener/v1/swagger.json",
    "google/webfonts/v1/swagger.json",
    "google/webmasters/v3/swagger.json",
    "google/youtube/v3/swagger.json",
    "google/youtubeAnalytics/v1/swagger.json",
    "google/youtubeAnalytics/v1beta1/swagger.json",
    "openexchangerates/openexchangerates/1.0.0/swagger.json"
  ];
}

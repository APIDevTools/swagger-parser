//
//if (env.isNode) {
//  var fs   = require('fs'),
//      path = require('path');
//
//  // Find all Swagger files, and add them to the env.realWorldFiles array
//  findSwaggerFiles(__dirname);
//
//  function findSwaggerFiles(dir) {
//    fs.readdirSync(dir).forEach(function(name) {
//      var fullName = path.join(dir, name);
//      var ext = path.extname(name);
//      var stat = fs.statSync(fullName);
//
//      if (stat.isFile() &&
//        ['.json', '.yaml', '.yml'].indexOf(ext) >= 0) {
//        // This is a Swagger file, so add it
//        env.realWorldFiles.push(path.relative(__dirname, fullName));
//      }
//      else if (stat.isDirectory()) {
//        // Recursively process this sub-directory
//        findSwaggerFiles(fullName);
//      }
//    });
//  }
//}
//else {
//  // In browsers, just use this hard-coded list of files
//  env.realWorldFiles = [
//    'bitdango.com/1.0.0/swagger.json',
//    'clickmeter.com/v2/swagger.json',
//    'datumbox.com/1.0/swagger.json',
//    'embarcadero.com/1.0.0/swagger.json',
//    'eriomem.net/0.1/swagger.json',
//    'firebrowse.org/1.1.10 beta (2015-06-09 09:57:15 49d9c62394f1b2c2c9db6e9f)/swagger.json',
//    'googleapis.com/adexchangebuyer/v1.2/swagger.json',
//    'googleapis.com/adexchangebuyer/v1.3/swagger.json',
//    'googleapis.com/adexchangeseller/v1/swagger.json',
//    'googleapis.com/adexchangeseller/v1.1/swagger.json',
//    'googleapis.com/adexchangeseller/v2.0/swagger.json',
//    'googleapis.com/admin/email_migration_v2/swagger.json',
//    'googleapis.com/admin/reports_v1/swagger.json',
//    'googleapis.com/adsense/v1.2/swagger.json',
//    'googleapis.com/adsense/v1.3/swagger.json',
//    'googleapis.com/adsense/v1.4/swagger.json',
//    'googleapis.com/adsensehost/v4.1/swagger.json',
//    'googleapis.com/analytics/v2.4/swagger.json',
//    'googleapis.com/analytics/v3/swagger.json',
//    'googleapis.com/androidenterprise/v1/swagger.json',
//    'googleapis.com/androidpublisher/v1/swagger.json',
//    'googleapis.com/androidpublisher/v1.1/swagger.json',
//    'googleapis.com/androidpublisher/v2/swagger.json',
//    'googleapis.com/appsactivity/v1/swagger.json',
//    'googleapis.com/appstate/v1/swagger.json',
//    'googleapis.com/autoscaler/v1beta2/swagger.json',
//    'googleapis.com/bigquery/v2/swagger.json',
//    'googleapis.com/blogger/v2/swagger.json',
//    'googleapis.com/blogger/v3/swagger.json',
//    'googleapis.com/books/v1/swagger.json',
//    'googleapis.com/calendar/v3/swagger.json',
//    'googleapis.com/civicinfo/v2/swagger.json',
//    'googleapis.com/cloudmonitoring/v2beta2/swagger.json',
//    'googleapis.com/cloudresourcemanager/v1beta1/swagger.json',
//    'googleapis.com/clouduseraccounts/alpha/swagger.json',
//    'googleapis.com/clouduseraccounts/vm_alpha/swagger.json',
//    'googleapis.com/compute/v1/swagger.json',
//    'googleapis.com/computeaccounts/alpha/swagger.json',
//    'googleapis.com/container/v1/swagger.json',
//    'googleapis.com/container/v1beta1/swagger.json',
//    'googleapis.com/content/v2/swagger.json',
//    'googleapis.com/coordinate/v1/swagger.json',
//    'googleapis.com/customsearch/v1/swagger.json',
//    'googleapis.com/dataflow/v1b3/swagger.json',
//    'googleapis.com/datastore/v1beta1/swagger.json',
//    'googleapis.com/datastore/v1beta2/swagger.json',
//    'googleapis.com/deploymentmanager/v2beta1/swagger.json',
//    'googleapis.com/deploymentmanager/v2beta2/swagger.json',
//    'googleapis.com/dfareporting/v1/swagger.json',
//    'googleapis.com/dfareporting/v1.1/swagger.json',
//    'googleapis.com/dfareporting/v1.2/swagger.json',
//    'googleapis.com/dfareporting/v1.3/swagger.json',
//    'googleapis.com/dfareporting/v2.0/swagger.json',
//    'googleapis.com/dfareporting/v2.1/swagger.json',
//    'googleapis.com/discovery/v1/swagger.json',
//    'googleapis.com/dns/v1/swagger.json',
//    'googleapis.com/dns/v1beta1/swagger.json',
//    'googleapis.com/doubleclickbidmanager/v1/swagger.json',
//    'googleapis.com/doubleclicksearch/v2/swagger.json',
//    'googleapis.com/drive/v1/swagger.json',
//    'googleapis.com/drive/v2/swagger.json',
//    'googleapis.com/fitness/v1/swagger.json',
//    'googleapis.com/freebase/v1/swagger.json',
//    'googleapis.com/freebase/v1-sandbox/swagger.json',
//    'googleapis.com/freebase/v1sandbox/swagger.json',
//    'googleapis.com/fusiontables/v1/swagger.json',
//    'googleapis.com/fusiontables/v2/swagger.json',
//    'googleapis.com/games/v1/swagger.json',
//    'googleapis.com/gamesConfiguration/v1configuration/swagger.json',
//    'googleapis.com/gamesManagement/v1management/swagger.json',
//    'googleapis.com/gan/v1beta1/swagger.json',
//    'googleapis.com/genomics/v1/swagger.json',
//    'googleapis.com/genomics/v1beta2/swagger.json',
//    'googleapis.com/gmail/v1/swagger.json',
//    'googleapis.com/groupsmigration/v1/swagger.json',
//    'googleapis.com/groupssettings/v1/swagger.json',
//    'googleapis.com/identitytoolkit/v3/swagger.json',
//    'googleapis.com/licensing/v1/swagger.json',
//    'googleapis.com/logging/v1beta3/swagger.json',
//    'googleapis.com/manager/v1beta2/swagger.json',
//    'googleapis.com/mirror/v1/swagger.json',
//    'googleapis.com/oauth2/v1/swagger.json',
//    'googleapis.com/oauth2/v2/swagger.json',
//    'googleapis.com/pagespeedonline/v1/swagger.json',
//    'googleapis.com/pagespeedonline/v2/swagger.json',
//    'googleapis.com/plus/v1/swagger.json',
//    'googleapis.com/plusDomains/v1/swagger.json',
//    'googleapis.com/prediction/v1.2/swagger.json',
//    'googleapis.com/prediction/v1.3/swagger.json',
//    'googleapis.com/prediction/v1.4/swagger.json',
//    'googleapis.com/prediction/v1.5/swagger.json',
//    'googleapis.com/prediction/v1.6/swagger.json',
//    'googleapis.com/qpxExpress/v1/swagger.json',
//    'googleapis.com/replicapool/v1beta1/swagger.json',
//    'googleapis.com/replicapool/v1beta2/swagger.json',
//    'googleapis.com/replicapoolupdater/v1beta1/swagger.json',
//    'googleapis.com/reseller/v1/swagger.json',
//    'googleapis.com/reseller/v1sandbox/swagger.json',
//    'googleapis.com/resourceviews/v1beta1/swagger.json',
//    'googleapis.com/resourceviews/v1beta2/swagger.json',
//    'googleapis.com/siteVerification/v1/swagger.json',
//    'googleapis.com/spectrum/v1explorer/swagger.json',
//    'googleapis.com/sqladmin/v1beta3/swagger.json',
//    'googleapis.com/sqladmin/v1beta4/swagger.json',
//    'googleapis.com/storage/v1/swagger.json',
//    'googleapis.com/storage/v1beta1/swagger.json',
//    'googleapis.com/storage/v1beta2/swagger.json',
//    'googleapis.com/tagmanager/v1/swagger.json',
//    'googleapis.com/taskqueue/v1beta1/swagger.json',
//    'googleapis.com/taskqueue/v1beta2/swagger.json',
//    'googleapis.com/tasks/v1/swagger.json',
//    'googleapis.com/translate/v2/swagger.json',
//    'googleapis.com/urlshortener/v1/swagger.json',
//    'googleapis.com/webfonts/v1/swagger.json',
//    'googleapis.com/webmasters/v3/swagger.json',
//    'googleapis.com/youtube/v3/swagger.json',
//    'googleapis.com/youtubeAnalytics/v1/swagger.json',
//    'googleapis.com/youtubeAnalytics/v1beta1/swagger.json',
//    'gsa.gov/0.1/swagger.json',
//    'owler.com/1.0.0/swagger.json',
//    'peel-ci.com/1.0.0/swagger.json',
//    'rummblelabs.com/1.0.0/swagger.json',
//    'slideroom.com/v2/swagger.json',
//    'spectrocoin.com/1.0.0/swagger.json',
//    'vatapi.com/1/swagger.json'
//  ];
//}

(function() {
  'use strict';

  // Splits the file path into separate parts:
  // 1 = Domain name (e.g. "googleapis.com", "core.ac.uk", etc.)
  // 2 = API name, if any (e.g. "adsense", "blogger", etc.)
  // 3 = API version (e.g. "1.0", "1.1.15 beta (2015-08-24)", etc.)
  var filePattern = /([^\\\/]+)(?:[\\\/]([^\\\/]+))?[\\\/]v?([^\\\/]+)[\\\/][^\\\/]+\.(?:json|yaml|yml)$/;

  var files = [];

  /**
   * Recursively crawls the given directory, looking for Swagger API files.
   * When it finds one, it adds it to the `files` array.
   *
   * @param {string} dir
   */
  function findSwaggerFiles(dir) {
    _fs.readdirSync(dir).forEach(function(name) {
      var absPath = _path.join(dir, name);
      var ext = _path.extname(name);
      var stat = _fs.statSync(absPath);

      if (stat.isFile() &&
        name !== 'patch.json' &&
        name !== 'fixup.json' &&
        ['.json', '.yaml', '.yml'].indexOf(ext) >= 0) {
        files.push(_path.relative(__dirname, absPath));
      }
      else if (stat.isDirectory()) {
        findSwaggerFiles(absPath);
      }
    });
  }

  /**
   * Parses each file path in the `files` array, and adds the parsed values to {@link global.realWorldAPIs}
   */
  function parseFiles(files) {
    global.realWorldAPIs = [];

    files.forEach(function(file) {
      var parts = filePattern.exec(file);

      if (!parts) {
        throw new Error('Swagger API does not match expected naming pattern: \n' + file);
      }

      global.realWorldAPIs.push({
        domain: parts[1],
        name: parts[2],
        version: parts[3],
        path: path.rel('specs/real-world/' + file)
      });
    });
  }

  if (userAgent.isNode) {
    var _fs   = require('fs'),
        _path = require('path');

    findSwaggerFiles(__dirname);

    //console.log(JSON.stringify(files, null, 6));
    //process.exit();

    parseFiles(files);
  }
  else {
    // In browsers, just use this hard-coded list of files
    parseFiles([
      "18f.us/0.1/swagger.json",
      "backupify.com/1.0.0/swagger.json",
      "bikewise.org/v2/swagger.json",
      "bitdango.com/1.0.0/swagger.json",
      "blackberry.com/1.0.0/swagger.json",
      "cambase.io/1.0/swagger.json",
      "citycontext.com/1.0.0/swagger.json",
      "clarify.io/1.0.8/swagger.json",
      "clickmeter.com/v2/swagger.json",
      "core.ac.uk/2.0/swagger.json",
      "cybertaxonomy.eu/1.0/swagger.json",
      "daisycon.com/1.0.0/swagger.json",
      "datumbox.com/1.0/swagger.json",
      "eriomem.net/0.1/swagger.json",
      "exavault.com/1.0.0/swagger.json",
      "firebrowse.org/1.1.15 beta (2015-08-24 18:25:33 )/swagger.json",
      "geneea.com/1.0/swagger.json",
      "geodesystems.com/1.0.0/swagger.json",
      "gettyimages.com/3.0/swagger.json",
      "glugbot.com/1/swagger.json",
      "googleapis.com/adexchangebuyer/v1.2/swagger.json",
      "googleapis.com/adexchangebuyer/v1.3/swagger.json",
      "googleapis.com/adexchangebuyer/v1.4/swagger.json",
      "googleapis.com/adexchangeseller/v1/swagger.json",
      "googleapis.com/adexchangeseller/v1.1/swagger.json",
      "googleapis.com/adexchangeseller/v2.0/swagger.json",
      "googleapis.com/admin/datatransfer_v1/swagger.json",
      "googleapis.com/admin/email_migration_v2/swagger.json",
      "googleapis.com/admin/reports_v1/swagger.json",
      "googleapis.com/adsense/v1.2/swagger.json",
      "googleapis.com/adsense/v1.3/swagger.json",
      "googleapis.com/adsense/v1.4/swagger.json",
      "googleapis.com/adsensehost/v4.1/swagger.json",
      "googleapis.com/analytics/v2.4/swagger.json",
      "googleapis.com/analytics/v3/swagger.json",
      "googleapis.com/androidenterprise/v1/swagger.json",
      "googleapis.com/androidpublisher/v1/swagger.json",
      "googleapis.com/androidpublisher/v1.1/swagger.json",
      "googleapis.com/androidpublisher/v2/swagger.json",
      "googleapis.com/appsactivity/v1/swagger.json",
      "googleapis.com/appstate/v1/swagger.json",
      "googleapis.com/autoscaler/v1beta2/swagger.json",
      "googleapis.com/bigquery/v2/swagger.json",
      "googleapis.com/blogger/v2/swagger.json",
      "googleapis.com/blogger/v3/swagger.json",
      "googleapis.com/books/v1/swagger.json",
      "googleapis.com/calendar/v3/swagger.json",
      "googleapis.com/civicinfo/v2/swagger.json",
      "googleapis.com/classroom/v1/swagger.json",
      "googleapis.com/clouddebugger/v2/swagger.json",
      "googleapis.com/cloudmonitoring/v2beta2/swagger.json",
      "googleapis.com/cloudresourcemanager/v1beta1/swagger.json",
      "googleapis.com/clouduseraccounts/alpha/swagger.json",
      "googleapis.com/clouduseraccounts/beta/swagger.json",
      "googleapis.com/clouduseraccounts/vm_alpha/swagger.json",
      "googleapis.com/clouduseraccounts/vm_beta/swagger.json",
      "googleapis.com/compute/v1/swagger.json",
      "googleapis.com/container/v1/swagger.json",
      "googleapis.com/content/v2/swagger.json",
      "googleapis.com/content/v2sandbox/swagger.json",
      "googleapis.com/coordinate/v1/swagger.json",
      "googleapis.com/customsearch/v1/swagger.json",
      "googleapis.com/dataflow/v1b3/swagger.json",
      "googleapis.com/datastore/v1beta1/swagger.json",
      "googleapis.com/datastore/v1beta2/swagger.json",
      "googleapis.com/deploymentmanager/v2/swagger.json",
      "googleapis.com/deploymentmanager/v2beta1/swagger.json",
      "googleapis.com/deploymentmanager/v2beta2/swagger.json",
      "googleapis.com/dfareporting/v1/swagger.json",
      "googleapis.com/dfareporting/v1.1/swagger.json",
      "googleapis.com/dfareporting/v1.2/swagger.json",
      "googleapis.com/dfareporting/v1.3/swagger.json",
      "googleapis.com/dfareporting/v2.0/swagger.json",
      "googleapis.com/dfareporting/v2.1/swagger.json",
      "googleapis.com/dfareporting/v2.2/swagger.json",
      "googleapis.com/discovery/v1/swagger.json",
      "googleapis.com/dns/v1/swagger.json",
      "googleapis.com/dns/v1beta1/swagger.json",
      "googleapis.com/doubleclickbidmanager/v1/swagger.json",
      "googleapis.com/doubleclicksearch/v2/swagger.json",
      "googleapis.com/drive/v1/swagger.json",
      "googleapis.com/drive/v2/swagger.json",
      "googleapis.com/fitness/v1/swagger.json",
      "googleapis.com/freebase/v1/swagger.json",
      "googleapis.com/fusiontables/v1/swagger.json",
      "googleapis.com/fusiontables/v2/swagger.json",
      "googleapis.com/games/v1/swagger.json",
      "googleapis.com/gamesConfiguration/v1configuration/swagger.json",
      "googleapis.com/gamesManagement/v1management/swagger.json",
      "googleapis.com/gan/v1beta1/swagger.json",
      "googleapis.com/genomics/v1beta2/swagger.json",
      "googleapis.com/gmail/v1/swagger.json",
      "googleapis.com/groupsmigration/v1/swagger.json",
      "googleapis.com/groupssettings/v1/swagger.json",
      "googleapis.com/identitytoolkit/v3/swagger.json",
      "googleapis.com/licensing/v1/swagger.json",
      "googleapis.com/logging/v1beta3/swagger.json",
      "googleapis.com/manager/v1beta2/swagger.json",
      "googleapis.com/mirror/v1/swagger.json",
      "googleapis.com/oauth2/v1/swagger.json",
      "googleapis.com/oauth2/v2/swagger.json",
      "googleapis.com/pagespeedonline/v1/swagger.json",
      "googleapis.com/pagespeedonline/v2/swagger.json",
      "googleapis.com/partners/v2/swagger.json",
      "googleapis.com/playmoviespartner/v1/swagger.json",
      "googleapis.com/plus/v1/swagger.json",
      "googleapis.com/plusDomains/v1/swagger.json",
      "googleapis.com/prediction/v1.2/swagger.json",
      "googleapis.com/prediction/v1.3/swagger.json",
      "googleapis.com/prediction/v1.4/swagger.json",
      "googleapis.com/prediction/v1.5/swagger.json",
      "googleapis.com/prediction/v1.6/swagger.json",
      "googleapis.com/qpxExpress/v1/swagger.json",
      "googleapis.com/replicapool/v1beta1/swagger.json",
      "googleapis.com/replicapool/v1beta2/swagger.json",
      "googleapis.com/replicapoolupdater/v1beta1/swagger.json",
      "googleapis.com/reseller/v1/swagger.json",
      "googleapis.com/reseller/v1sandbox/swagger.json",
      "googleapis.com/resourceviews/v1beta1/swagger.json",
      "googleapis.com/resourceviews/v1beta2/swagger.json",
      "googleapis.com/siteVerification/v1/swagger.json",
      "googleapis.com/spectrum/v1explorer/swagger.json",
      "googleapis.com/sqladmin/v1beta3/swagger.json",
      "googleapis.com/sqladmin/v1beta4/swagger.json",
      "googleapis.com/storage/v1/swagger.json",
      "googleapis.com/storage/v1beta1/swagger.json",
      "googleapis.com/storage/v1beta2/swagger.json",
      "googleapis.com/tagmanager/v1/swagger.json",
      "googleapis.com/taskqueue/v1beta1/swagger.json",
      "googleapis.com/taskqueue/v1beta2/swagger.json",
      "googleapis.com/tasks/v1/swagger.json",
      "googleapis.com/translate/v2/swagger.json",
      "googleapis.com/urlshortener/v1/swagger.json",
      "googleapis.com/webfonts/v1/swagger.json",
      "googleapis.com/webmasters/v3/swagger.json",
      "googleapis.com/youtube/v3/swagger.json",
      "googleapis.com/youtubeAnalytics/v1/swagger.json",
      "googleapis.com/youtubeAnalytics/v1beta1/swagger.json",
      "gsa.gov/0.1/swagger.json",
      "hetras.net/1.0.0/swagger.json",
      "iamreal.me/1.0.0/swagger.json",
      "idtbeyond.com/1.0.0/swagger.json",
      "infermedica.com/v1/swagger.json",
      "instagram.com/1.0.0/swagger.json",
      "likefolio.com/v0/swagger.json",
      "loginbycall.com/v1/swagger.json",
      "magick.nu/1.0/swagger.json",
      "mondiamedia.com/2.9.10/swagger.json",
      "moonmoonmoonmoon.com/1.0/swagger.json",
      "neowsapp.com/1.0/swagger.json",
      "nrel.gov/0.1.0/swagger.json",
      "nsidc.org/1.0.0/swagger.json",
      "oceandrivers.com/1.0/swagger.json",
      "orghunter.com/1.0.0/swagger.json",
      "owler.com/1.0.0/swagger.json",
      "pandorabots.com/1.0.0/swagger.json",
      "patientview.org/1.0/swagger.json",
      "peel-ci.com/1.0.0/swagger.json",
      "pollencheck.eu/1.0.0/swagger.json",
      "posty-api.herokuapp.com/v1/swagger.json",
      "prd-prsn.com/1.0.0/swagger.json",
      "reactome.org/1.0/swagger.json",
      "rummblelabs.com/1.0.0/swagger.json",
      "scrapewebsite.email/0.1/swagger.json",
      "slideroom.com/v2/swagger.json",
      "solarvps.com/1.0.0/swagger.json",
      "spectrocoin.com/1.0.0/swagger.json",
      "storecheckerapi.com/0.1/swagger.json",
      "taxamo.com/1/swagger.json",
      "unavco.org/1.0.0/swagger.json",
      "vatapi.com/1/swagger.json",
      "waag.org/v1/swagger.json",
      "yunbi.com/v2/swagger.json",
      "zoomconnect.com/1/swagger.json"
    ]);
  }

})();

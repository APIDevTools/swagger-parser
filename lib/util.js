"use strict";

const util = require("util");
const {URL} = require('url');

exports.format = util.format;
exports.inherits = util.inherits;

/**
 * Regular Expression that matches Swagger path params.
 */
exports.swaggerParamRegExp = /\{([^/}]+)}/g;

/**
 * List of HTTP verbs used for OperationItem as per the Swagger specification
 */
const operationsList = ['get','post','put','delete','patch','options','head','trace'];

const fixServersFn = function (server,path) {
    //Server url starting with '/' tells that it is not an http(s) url
    if (server.url?.startsWith("/")) {
        const inUrl = new URL(path);
        var finalUrl = inUrl.protocol + "//" + inUrl.hostname + server.url;
        server.url = finalUrl;
        return server;
    }
}
async function fixOasRelativeServers(schema,filePath) {
    if (schema?.openapi && (filePath?.startsWith("http:") || filePath?.startsWith("https:"))) {
        /** 
         * From OpenAPI v3 spec for Server object's url property: "REQUIRED. A URL to the target host. 
         * This URL supports Server Variables and MAY be relative, to indicate that the host location is relative to the location where 
         * the OpenAPI document is being served.""
         * 
         * Further, the spec says that "servers" property can show up at root level, in 'Path Item' object or in 'Operation' object.
         * However, interpretation of the spec says that relative paths for servers should take into account the hostname that
         * serves the OpenAPI file.
        */
        // Root level servers array's fixup
        schema.servers?.map(server => fixServersFn(server,filePath));

        // Path or Operation level servers array's fixup
        Object.keys(schema.paths).forEach(path => {
            const pathItem = schema.paths[path];
            Object.keys(pathItem).forEach(opItem => {
                if(opItem === "servers"){
                    //servers at pathitem level
                    pathItem[opItem].map(server => fixServersFn(server,filePath));
                }else if(operationsList.includes(opItem)){
                    //servers at operation level
                    pathItem[opItem].servers?.map(server => fixServersFn(server,filePath));
                }
            });
        });
    } else {
        //Do nothing and return
    }
}

exports.fixOasRelativeServers = fixOasRelativeServers;
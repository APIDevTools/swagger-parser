# Security Considerations

## Avoiding Local File Inclusion

### Default Behaviour

The library, by default, attempts to resolve any files pointed to by `$ref`, which can be a problem in specific scenarios, for example:

- A backend service uses the library, AND
- The service processes OpenAPI documents from untrusted sources, AND
- The service performs actual requests based on the processed OpenAPI document

For example, the below OpenAPI document refers to `/etc/passwd` via the `leak` property of the Pet object.

```yaml
openapi: 3.0.2
info:
  title: Example Document based on PetStore
  version: 1.0.11
servers:
  - url: /api/v3
paths:
  /pet:
    put:
      summary: Update an existing pet
      description: CHECK THE PET OBJECT leak PROPERTY!
      operationId: updatePet
      requestBody:
        description: Update an existent pet in the store
        content:
          application/json:
            schema:
              $ref: "#/components/schemas/Pet"
        required: true
components:
  schemas:
    Pet:
      required:
        - name
        - photoUrls
      type: object
      properties:
        id:
          type: integer
          format: int64
          example: 10
        leak:
          type: string
          default:
            $ref: "/etc/passwd"
        name:
          type: string
          example: doggie
      xml:
        name: pet
```

The following example uses swagger-parser to process the above document.

```
import SwaggerParser from '@apidevtools/swagger-parser';

const documentSource = './document-shown-above.yml';
const doc = await SwaggerParser.dereference(documentSource);
console.log(doc.paths['/pet'].put.requestBody.content['application/json'].schema);
```

A snippet of the resolved document is shown below.

```
{
  required: [ 'name', 'photoUrls' ],
  type: 'object',
  properties: {
    id: { type: 'integer', format: 'int64', example: 10 },
    leak: {
      type: 'string',
      default: 'nobody:*:-2:-2:Unprivileged User:/var/empty:/usr/bin/false root:*:0:0:System Administrator:/var/root:/bin/sh daemon:*:1:1:System Services:/var/root:/usr/bin/false _uucp:*:4:4:Unix to Unix Copy Protocol:/var/spool/uucp:/usr/sbin/uucico _taskgated:*:13:13:Task Gate Daemon:/var/empty:/usr/bin/false _networkd:*:24:24:Network Services:/var/networkd:/usr/bin/false _installassistant:*:25:25:Install Assistant:/var/empty:/usr/bin/false _lp:*
```

You can mitigate the discussed behaviour by putting restrictions on file extensions and being mindful of the environment the service is running in. The following sections will go into more detail on these.

### Restrictions based on File Extension

You can and should configure the file resolver to only process YAML and JSON files. An example of how you can do this is shown below.

```
const doc = await SwaggerParser.dereference(documentSource, {
    resolve: {
        file: {
            canRead: ['.yml', '.json']
        }
    }
});
```

As a result, any attempt to resolve files other than YAML and JSON will result in the following error.

```
SyntaxError: Unable to resolve $ref pointer "/etc/passwd"
    at onError (node_modules/@apidevtools/json-schema-ref-parser/lib/parse.js:85:20) {
  toJSON: [Function: toJSON],
  [Symbol(nodejs.util.inspect.custom)]: [Function: inspect]
}
```

Configuring the file resolver this way only partially mitigates LFI. See the next section for additional considerations.

### Environmental Considerations

With the previously mentioned mitigation in place, an attacker could still craft a malicious OpenAPI document to make the library read arbitrary JSON or YAML files on the filesystem and potentially gain access to sensitive data (e.g. credentials). This is possible if:

- The actor knows (or successfully guesses) the location of a JSON or YAML file on the file system
- The service using the library has privileges to read the file
- The service using the library sends requests to the server specified in the OpenAPI document

You can prevent exploitation by hardening the environment in which the service is running:

- The service should run under its own dedicated user account
- File system permissions should be configured so that the service cannot read any YAML or JSON files not owned by the service user

If you have any YAML or JSON files the service must have access to that may contain sensitive information, such as configuration file(s), you must take additional measures to prevent exploitation. A non-exhaustive list:

- You can implement your service so that it reads the configuration into memory at start time, then uses [setuid](https://nodejs.org/api/process.html#processsetuidid) and [setgid](https://nodejs.org/api/process.html#processsetgidid) to set the process' UID and GID to the ID of a user and ID of a group that has no access to the file on the filesystem
- Do not store sensitive information, such as credentials, in the service configuration files

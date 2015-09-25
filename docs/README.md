Swagger Parser API
==========================

Things to Know
---------------------
- [Class methods vs. Instance methods](#class-methods-vs-instance-methods)
- [Callbacks vs. Promises](#callbacks-vs-promises)
- [Circular references](#circular-refs)


Classes & Methods
---------------------

#### [`SwaggerParser`](swagger-parser.md)
- [`api`](swagger-parser.md#schema)
- [`$refs`](swagger-parser.md#schema)
- [`validate()`](swagger-parser.md#validateapi-options-callback)
- [`dereference()`](swagger-parser.md#dereferenceapi-options-callback)
- [`bundle()`](swagger-parser.md#bundleapi-options-callback)
- [`parse()`](swagger-parser.md#parseapi-options-callback)
- [`resolve()`](swagger-parser.md#resolveapi-options-callback)

#### [`$Refs`](#refs.md)
- [`paths()`](refs.md#pathstypes)
- [`values()`](refs.md#valuestypes)
- [`isExpired()`](refs.md#isexpiredref)
- [`expire()`](refs.md#expireref)
- [`exists()`](refs.md#existsref)
- [`get()`](refs.md#getref-options)
- [`set()`](refs.md#setref-value-options)

#### [`YAML`](yaml.md)
- [`parse()`](yaml.md#parsetext)
- [`stringify()`](yaml.md#stringifyvalue)

#### [`Options`](options.md)


### Class methods vs. Instance methods
All of Swagger Parser's methods are available as static (class) methods, and as instance methods.  The static methods simply create a new [`SwaggerParser`](swagger-parser.md) instance and then call the corresponding instance method.  Thus, the following line...

```javascript
SwaggerParser.validate("my-api.yaml");
```

... is the same as this:

```javascript
var parser = new SwaggerParser();
parser.validate("my-api.yaml");
```

The difference is that in the second example you now have a reference to `parser`, which means you can access the results ([`parser.api`](swagger-parser.md#api-object) and [`parser.$refs`](swagger-parser.md#refs-object)) anytime you want, rather than just in the callback function. Also, having a `SwaggerParser` instance allows you to benefit from **[caching](options.md#caching)**, so the next time you call [`parser.resolve()`](swagger-parser.md#resolveapi-options-callback), it won't need to re-download those files again (as long as the cache hasn't expired).


### Callbacks vs. Promises
Many people prefer [ES6 Promise syntax](http://javascriptplayground.com/blog/2015/02/promises/) instead of callbacks.  Swagger Parser allows you to use whichever one you prefer.  Every method accepts an optional callback _and_ returns a Promise.  So pick your poison.

```javascript
SwaggerParser.validate(myAPI, function(err, api) {
        // Callback (success or error)
    })
    .then(function(api) {
        // Promise (success)
    })
    .catch(function(err) {
        // Promise (error)
    });
```


### Circular $Refs
Swagger APIs can contain [circular $ref pointers](https://gist.github.com/BigstickCarpet/d18278935fc73e3a0ee1), and Swagger Parser fully supports them. Circular references can be resolved and dereferenced just like any other reference.  However, if you intend to serialize the dereferenced api as JSON, then you should be aware that [`JSON.stringify`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify) does not support circular references by default, so you will need to [use a custom replacer function](https://stackoverflow.com/questions/11616630/json-stringify-avoid-typeerror-converting-circular-structure-to-json).

You can disable circular references by setting the [`$refs.circular`](options.md) option to `false`. Then, if a circular reference is found, a `ReferenceError` will be thrown.

Another option is to use the [`bundle`](swagger-parser.md#bundleapi-options-callback) method rather than the [`dereference`](swagger-parser.md#dereferenceapi-options-callback) method.  Bundling does _not_ result in circular references, because it simply converts _external_ `$ref` pointers to _internal_ ones.

```javascript
"person": {
    "properties": {
        "name": {
          "type": "string"
        },
        "spouse": {
          "type": {
            "$ref": "#/person"        // circular reference
          }
        }
    }
}
```

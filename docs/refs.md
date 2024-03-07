# `$Refs` class

When you call the [`resolve`](swagger-parser.md#resolveschema-options-callback) method, the value that gets passed to the callback function (or Promise) is a `$Refs` object. This same object is accessible via the [`parser.$refs`](swagger-parser.md#refs) property of `SwaggerParser` objects.

This object is a map of JSON References and their resolved values. It also has several convenient helper methods that make it easy for you to navigate and manipulate the JSON References.

##### Properties

- [`circular`](#circular)

##### Methods

- [`paths()`](#pathstypes)
- [`values()`](#valuestypes)
- [`exists()`](#existsref)
- [`get()`](#getref-options)
- [`set()`](#setref-value-options)

### `circular`

- **Type:** `boolean`

This property is `true` if the API contains any [circular references](README.md#circular-refs). You may want to check this property before serializing the dereferenced schema as JSON, since [`JSON.stringify()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify) does not support circular references by default.

```javascript
let parser = new SwaggerParser();
await parser.dereference("my-api.yaml");

if (parser.$refs.circular) {
  console.log("The API contains circular references");
}
```

### `paths([types])`

- **types** (_optional_) - `string` (one or more)<br>
  Optionally only return certain types of paths ("file", "http", etc.)

- **Return Value:** `array` of `string`<br>
  Returns the paths/URLs of all the files in your API (including the main api file).

```javascript
let $refs = await SwaggerParser.resolve("my-api.yaml");

// Get the paths of ALL files in the API
$refs.paths();

// Get the paths of local files only
$refs.paths("fs");

// Get all URLs
$refs.paths("http", "https");
```

### `values([types])`

- **types** (_optional_) - `string` (one or more)<br>
  Optionally only return values from certain locations ("file", "http", etc.)

- **Return Value:** `object`<br>
  Returns a map of paths/URLs and their correspond values.

```javascript
let $refs = await SwaggerParser.resolve("my-api.yaml");

// Get ALL paths & values in the API
// (this is the same as $refs.toJSON())
let values = $refs.values();

values["schemas/person.yaml"];
values["http://company.com/my-api.yaml"];
```

### `exists($ref)`

- **$ref** (_required_) - `string`<br>
  The JSON Reference path, optionally with a JSON Pointer in the hash

- **Return Value:** `boolean`<br>
  Returns `true` if the given path exists in the API; otherwise, returns `false`

```javascript
let $refs = await SwaggerParser.resolve("my-api.yaml");

$refs.exists("schemas/person.yaml#/properties/firstName"); // => true
$refs.exists("schemas/person.yaml#/properties/foobar"); // => false
```

### `get($ref, [options])`

- **$ref** (_required_) - `string`<br>
  The JSON Reference path, optionally with a JSON Pointer in the hash

- **options** (_optional_) - `object`<br>
  See [options](options.md) for the full list of options

- **Return Value:** `boolean`<br>
  Gets the value at the given path in the API. Throws an error if the path does not exist.

```javascript
let $refs = await SwaggerParser.resolve("my-api.yaml");
let value = $refs.get("schemas/person.yaml#/properties/firstName");
```

### `set($ref, value, [options])`

- **$ref** (_required_) - `string`<br>
  The JSON Reference path, optionally with a JSON Pointer in the hash

- **value** (_required_)<br>
  The value to assign. Can be anything (object, string, number, etc.)

- **options** (_optional_) - `object`<br>
  See [options](options.md) for the full list of options

Sets the value at the given path in the API. If the property, or any of its parents, don't exist, they will be created.

```javascript
let $refs = await SwaggerParser.resolve("my-api.yaml");
$refs.set("schemas/person.yaml#/properties/favoriteColor/default", "blue");
```

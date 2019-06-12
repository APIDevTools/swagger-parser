`YAML` object
==========================

This object provides simple YAML parsing functions.  Swagger Parser uses this object internally
for its own YAML parsing, but it is also exposed so you can use it in your code if needed.


### `parse(text)`

- **text** (_required_) - `string`<br>
The YAML string to be parsed.

- **Return Value:**<br>
Returns the parsed value, which can be any valid JSON type (object, array, string, number, etc.)

This method is similar to [`JSON.parse()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/parse), but it supports YAML _in addition_ to JSON (since any JSON document is also a valid YAML document).

```javascript
let YAML = SwaggerParser.YAML;
let text = "title: person \n" +
           "required: \n" +
           "  - name \n" +
           "  - age \n" +
           "properties: \n" +
           "  name: \n" +
           "    type: string \n" +
           "  age: \n" +
           "    type: number"

let obj = YAML.parse(text);

// {
//   title: "person",
//   required: ["name", "age"],
//   properties: {
//     name: {
//       type: "string"
//     },
//     age: {
//       type: "number"
//     }
//   }
// }
```


### `stringify(value)`

- **value** (_required_)<br>
The value to be converted to a YAML string. Can be any valid JSON type (object, array, string, number, etc.)

- **Return Value:** `string`<br>
Returns the a YAML string containing the serialized value

This method is similar to [`JSON.stringify()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify), except that it converts a value to a YAML string instead of a JSON string.

```javascript
let YAML = SwaggerParser.YAML;
let obj = {
  title: "person",
  required: ["name", "age"],
  properties: {
    name: {
      type: "string"
    },
    age: {
      type: "number"
    }
  }
};


let string = YAML.stringify(obj);

// title: person
// required:
//   - name
//   - age
// properties:
//   name:
//     type: string
//   age:
//     type: number
```

# x3dvalidate
Validate JSON files against various versions of X3D JSON schema with Ajv

```bash
git clone https://github.com/coderextreme/x3dvalidate
cd x3dvalidate
npm install
node x3dvalidate.js flipper.json
node app.js
```

JavaScript usage:

```js
var validate = require('x3dvalidate')

process.argv.shift();
process.argv.shift();
var files = process.argv;

var language = "de";

validate(language, files);

```

Referring to this project in package.json:

```js
{
  "name": "usevalidate",
  "version": "1.0.0",
  "private": true,
  "dependencies": {
    "x3dvalidate": "git://github.com/coderextreme/x3dvalidate.git"
  }
}
```


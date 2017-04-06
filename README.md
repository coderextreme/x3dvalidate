# x3dvalidate
Validate JSON files against various versions of X3D JSON schema with Ajv

```bash
git clone https://github.com/coderextreme/x3dvalidate
cp file.json x3dvalidate
cd x3dvalidate
npm install
node app.js file.json
```

JavaScript usage:

```js
var validate = require('x3dvalidate')

process.argv.shift();
process.argv.shift();
var files = process.argv;

validate(files);

```


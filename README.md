# x3dvalidate
Validate JSON files (.x3dj) X3D JSON schema with Ajv

```bash
git clone https://github.com/coderextreme/x3dvalidate
cd x3dvalidate
npm install
node x3dvalidate.js flipper.json # more JSON files are allowed, or .x3dj
node index.js flipper.json more JSON files are allowed, or .x3dj
node app.js # simple test app
```

JavaScript usage:

```js
var validate = require('x3dvalidate')

validate(files);
```

# x3dvalidate
Validate JSON files (.x3dj) X3D JSON schema with Ajv

```bash
git clone https://github.com/coderextreme/x3dvalidate
cd x3dvalidate
npm install
node src/x3dvalidate.js ball.json # ball.json for example, other replacement JSON files are allowed, or .x3dj
node test/app.js # simple test app
```

JavaScript usage:

```js
var validate = require('x3dvalidate')

validate(files);
```

# x3dvalidate
Validate JSON files (.x3dj) against X3D JSON schema version 4.0 with Ajv

Node.js is a requirement: Download from https://nodejs.org/

```bash
git clone https://github.com/coderextreme/x3dvalidate
cd x3dvalidate
npm install
node x3dvalidate.js examples/*.json    # use your own .x3dj or .json files (any extension works)
node test/app.js # simple test app

We are working on an npx command, but presently we can't publish right now (tommorrow)
```

For folders, I recommend using find and xargs on Linux/MacOS/Git for Windows/Git Bash/WSL

Example:
```bash
find ./examples -type f -name "*.json" | xargs node x3dvalidate.js
```

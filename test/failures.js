
#!/usr/bin/env node

var validate = require(__dirname+'/../src/index');

var files = [
__dirname+"/../examples.bad/abox.json",
__dirname+"/../examples/HelloWorldProgramOutput.json",
__dirname+"/../examples/HelloWorldProgramOutput2.json"
];

validate(files);

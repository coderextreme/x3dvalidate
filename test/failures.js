#!/usr/bin/env node

var validate = require(__dirname+'/../src/index');

var files = [
__dirname+"/../examples.bad/abox.json",
__dirname+"/../examples.bad/HelloWorldProgramOutput.json",
"--fullreport",
__dirname+"/../examples.bad/HelloWorldProgramOutput2.json"
];

validate(files);

#!/usr/bin/env node
"use strict"
var validate = require('./src/index.js')

process.argv.shift();
process.argv.shift();
var files = process.argv;
if (files.length === 0) {
	console.log("I see", files.length, "parameters.  Is x3dvalidate installed properly?");
}

validate(files);

process.exit()

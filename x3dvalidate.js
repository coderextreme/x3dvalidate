#!/usr/bin/env node

var validate = require('./src/index.js')

process.argv.shift();
process.argv.shift();
var files = process.argv;

validate(files);

process.exit()

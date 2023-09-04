#!/usr/bin/env node
"use strict"

var validate = require('../index.js')

process.argv.shift();
process.argv.shift();
var files = process.argv;

validate(files);

process.exit()

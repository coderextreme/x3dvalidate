#!/usr/bin/env node

import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

import validateJSON from "../index.js";

var files = [
__dirname+"/../examples.bad/abox.json",
__dirname+"/../examples.bad/HelloWorldProgramOutput.json",
"--fullreport",
__dirname+"/../examples.bad/HelloWorldProgramOutput2.json"
];

validateJSON(files);

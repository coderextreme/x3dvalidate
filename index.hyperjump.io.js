#!/usr/bin/env node
"use strict";

import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

import fs from 'fs';
import selectObjectFromJson from './selectObjectFromJson.js';
import { registerSchema, validate } from "@hyperjump/json-schema/draft-2020-12";
import { BASIC } from "@hyperjump/json-schema/experimental";
import { jsonSchemaErrors } from "@hyperjump/json-schema-errors";
import { setNormalizationHandler, evaluateSchema } from "@hyperjump/json-schema-errors";

const KEYWORD_URI = "https://json-schema.org/keyword/allOf";

setNormalizationHandler(KEYWORD_URI, {
  evaluate(allOf, instance, context) {
    return allOf.map((schemaLocation) => evaluateSchema(schemaLocation, instance, context));
  },
  simpleApplicator: true
});

let schemaUri = "https://x3d-4.1-JSONSchema.json";
let schema = fs.readFileSync(__dirname+"/schemas/x3d-4.1-JSONSchema.json");
let schemajson = JSON.parse(schema.toString());
registerSchema(schemajson, schemaUri);
console.log("Schema 4.1 added");

export default async function validateJSON(files, schemaUri, schemajson) {

	if (files.length === 0) {
		console.error("Please specify some .json or .x3dj JSON filenames (any filename path) to validate on the command-line, or in the validate/validateJSON function call.");
		process.exit();
	}
	let file = "No file present in exception";
	for (let f in files) {
		file = files[f];
		let str = fs.readFileSync(file).toString();
		if (typeof str === 'undefined') {
			throw("Read nothing, or possible error");
		}
		try {
		    let json = JSON.parse(str);
		    const output = await validate(schemaUri, json, BASIC);
		    const errors = await jsonSchemaErrors(output, schemaUri, json);
		    console.log(errors);
		} catch (err) {
			console.log("Error caught syntax with file", file, err);
		}
	}
}

process.argv.shift();
process.argv.shift();
let files = process.argv;
if (files.length === 0) {
	console.log("No parameters.  Assuming this is being used by import");
} else {
	validateJSON(files, schemaUri, schemajson);
}

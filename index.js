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
		    await validate(schemaUri, json, BASIC)
			.then(response => {
				if (response.valid) {
					console.log("Success validating file", file);
				} else {
					console.log("Error invalid file", file);
					for (let e in response.errors) {
						let error = response.errors[e];
						if (!error.keyword.endsWith("validate")) {
							console.log("keyword:", error.keyword.substr(error.keyword.lastIndexOf("/")+1));
							////////////////////////////////////////////////////////
							let schemaPath = error.absoluteKeywordLocation.substr(error.absoluteKeywordLocation.lastIndexOf("#")+2).replaceAll("/", " > ");
							console.log("schema location:", schemaPath);
							let schemaSelectedObject = selectObjectFromJson(schemajson, schemaPath);
							console.log( "schema value:", JSON.stringify(schemaSelectedObject,
								function(k, v) {
								    let v2 = JSON.parse(JSON.stringify(v));
								    if (typeof v2 === 'object') {
									    for (let o in v2) {
										    /*
										if (typeof v2[o] === 'object') {
											    v2[o] = "|omitted|";
										}
										*/
									    }
								    }
								    return v2;
								}));

							////////////////////////////////////////////////////////
							let instancePath = error.instanceLocation.substr(error.instanceLocation.lastIndexOf("#")+2).replaceAll("/", " > ");
							console.log("instance location:", instancePath)
							let instanceSelectedObject = selectObjectFromJson(json, instancePath);
							console.log("instance value:", JSON.stringify(instanceSelectedObject));
							console.log( "instance shorthand value:", JSON.stringify(instanceSelectedObject,
								function(k, v) {
								    let v2 = JSON.parse(JSON.stringify(v));
								    if (typeof v2 === 'object') {
									    for (let o in v2) {
										if (typeof v2[o] === 'object') {
											    v2[o] = "|omitted|";
										}
									    }
								    }
								    return v2;
								}));
							console.log();
						}
					}
				}
			})
			.catch(error => {
				console.log("Error caught problem with file", file, error);
			});
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

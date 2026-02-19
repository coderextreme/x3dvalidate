import Ajv2020 from "ajv/dist/2020.js";
import addFormats from "ajv-formats-draft2019";
var ajv = new Ajv2020({ strict: false, allowUnionTypes: true, allErrors: true });
addFormats(ajv, {mode: "full", formats: ["uri-reference", "uri", "iri-reference", "iri"], keywords: true});  // fast mode is "fast"

import fs from 'fs';

import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function validateSchema() {
fetch("https://json-schema.org/draft/2020-12/schema")
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json(); // This returns a new Promise
  })
  .then(schema => {
    	// console.log(schema);
	let json = JSON.parse(fs.readFileSync(__dirname+'/schemas/geoSystem.json').toString());
	const validate = ajv.compile(schema);
	// const valid = validate(json);
	if (!valid) parseErrors(validate.errors);
  })
  .catch(error => {
    console.error('Error fetching or parsing data:', error); //
  });
//	delete schema['$id'];
	//delete schema['$schema'];
}

function parseErrors(errors) {
	if (errors !== null) {
		let errs = errors;
		console.log(errs);
		for (let e in errs) {
			if (e == 0) {
			    console.log(e, 'Ajv '+version+' Validation failed on', file);
			}
			let error = "";
			error += "\r\n keyword: " + errs[e].keyword + "\r\n";
			let instancePath = errs[e].instancePath.replace(/^\./, "").replace(/[\.\[\]']+/g, " > ").replace(/ >[ \t]*$/, "");

			error += " instancePath: " + instancePath+ "\r\n";
			let selectedObject = selectObjectFromJson(json, instancePath);
			error += " value: " + JSON.stringify(selectedObject,
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
				}) + "\r\n";
			error += " message: " + errs[e].message + "\r\n";
			error += " params: " + JSON.stringify(errs[e].params) + "\r\n";
			error += " file: " + file + "\r\n";
			error += " version: " + version + "\r\n";
			console.log(error);
		}
	}
}
validateSchema()

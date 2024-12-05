#!/usr/bin/env node

"use strict";
const Ajv2020 = require("ajv/dist/2020");
// const addFormats = require("ajv-formats");
const apply = require('ajv-formats-draft2019');
let ajv = new Ajv2020({ strict: false });
// addFormats(ajv, {mode: "full", formats: ["uri-reference", "uri"], keywords: true});  // fast mode is "fast"
apply(ajv, {mode: "full", formats: ["iri-reference", "iri"], keywords: true});  // fast mode is "fast"
let fs = require('fs');
let http = require('http');

let validate = function() { return false; }

let suppress = true;



function doOneErr(err, file, version) {
	let error = "\r\n keyword: " + err.keyword + "\r\n";
	error += " location in document: " + err.instancePath + "\r\n";
	error += " message: " + err.message + "\r\n";
	error += " params: " + JSON.stringify(err.params) + "\r\n";
	error += " file: " + file + "\r\n";
	error += " version: " + version + "\r\n";
	return error
}

function doValidate(json, validated_version, file, success, failure) {
	let retval = false;
	let version = json.X3D["@version"];
	let error = ""
	if (typeof validated_version !== 'undefined') {
		let valid = validated_version(json);
		if (!valid) {
			console.log("================================================================================");
			console.log("File:", file);
			let errs = validated_version.errors;
			for (let e in errs) {
				if ('params' in errs[e] && 'missingProperty' in errs[e].params && errs[e].params.missingProperty === '@USE') {
					if (suppress) {
						console.log("Suppressing @USE missing property.  Use --fullreport to reveal possibly confusing errors");
					} else {
						error += doOneErr(errs[e], file, version);

					}
				} else if ('params' in errs[e] && 'passingSchemas' in errs[e].params && errs[e].params.passingSchemas === null) {
					if (suppress) {
						console.log("Suppressing null passingSchemas.  Use --fullreport to reveal possibly confusing errors");
					} else {
						error += doOneErr(errs[e], file, version);
					}
				} else {
					error += doOneErr(errs[e], file, version);
				}
			}
			failure(error);
		} else {
			if (typeof success == 'function') {
				success();
			} else {
				failure("No success function");
			}
		}
	} else {
		failure("Schema not loaded");
	}
}

function loadSchema(json, file, doValidate, success, failure) {
	let versions = { "4.0":true }
	let version = json.X3D["@version"];
	if (!versions[version]) {
		console.log("Can only validate version X3D 4.0 presently. Switching version to X3D 4.0.");
		version = "4.0";
	}
	let validated_version = validate[version];
        if (typeof validated_version === 'undefined') {

		
		/*
		console.log("Loading meta schema");
		let metaschema = fs.readFileSync('draft-07-JSONSchema.json');
		console.log("Parsing meta schema");
		let metaschemajson = JSON.parse(metaschema.toString());
		console.log("Adding meta schema");
		ajv.addMetaSchema(metaschemajson);
		*/
		console.log("Loading schema");
		let schema = fs.readFileSync(__dirname+"/schemas/x3d-"+version+"-JSONSchema.json");
		// let schema = fs.readFileSync("X3dXml4.0SchemaConvertedToJson2020-12Schema.json");
		console.log("Parsing schema");
		let schemajson = JSON.parse(schema.toString());
		console.log("Adding schema");
		ajv.addSchema(schemajson);
		console.log("Schema", version, "added");
		validated_version = ajv.compile(schemajson);
		validate[version] = validated_version;
		if (typeof validated_version === 'undefined') {
			console.log("Schema", version, "not compiled");
		} else {
			console.log("Schema", version, "compiled");
		}
		doValidate(json, validated_version, file, success, failure);
	} else {
		doValidate(json, validated_version, file, success, failure);
	}
}

function validateJSON(files) {

	if (files.length === 0) {
		console.error("Please specify some .json or .x3dj JSON filenames (any filename path) to validate on the command-line, or in the validate/validateJSON function call.  Full help is available via the --help command line option.");
		process.exit();
	}
	let file = "No file present in exception";
	for (let f in files) {
		try {
			file = files[f];
			if (file === "--fullreport") {
				console.log("Toggling suppression in in files now.");
				suppress = !suppress;
				continue;
			}
			if (file === "--help") {
				console.log("Help on x3dvalidate.js command.\n")
				console.log("node x3dvalidate.js [ --fullreport] [ --help ] json_file ...\n")
				console.log("Parameters to x3dvalidate are usually .json or .x3dj filenames on the filesystem")
				console.log("--fullreport : toggles full Ajv reporting.  May be used more than once to togle the full report")
				console.log("--help : returns this message")
				continue;
			}
			let str = fs.readFileSync(file).toString();
			if (typeof str === 'undefined') {
				throw("Read nothing, or possible error");
			}
			let json = JSON.parse(str);
			let version = json.X3D["@version"];
			loadSchema(json, file, doValidate, function() {
				console.log("Success validating file", file);
			}, function(e) {
				console.log("Error invalid file", file, e);

			});
		} catch (e) {
			console.log("================================================================================");
			console.log("File:", file);
			console.log(e);
		}
	}
}

module.exports = validateJSON

//alx:
//console.log('alx: '+exchangeajvmessage('should NOT have 123 then abc'));

process.argv.shift();
process.argv.shift();
var files = process.argv;
if (files.length === 0) {
	console.log("I see", files.length, "parameters.  Is x3dvalidate installed properly?");
}

validateJSON(files);

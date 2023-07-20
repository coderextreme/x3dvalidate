#!/usr/bin/env node

"use strict";
const Ajv2020 = require("ajv/dist/2020");
const addFormats = require("ajv-formats");
let ajv = new Ajv2020({ strict: false });
addFormats(ajv);
let fs = require('fs');
let http = require('http');
// let jsonlint = require('@prantlf/jsonlint');
let selectObjectFromJson = require(__dirname+'/selectObjectFromJson');

let validate = function() { return false; }

let override = false;


function doValidate(json, validated_version, file, success, failure) {
	let retval = false;
	let version = json.X3D["@version"];
	let error = ""
	if (file === "--override") {
		console.log("overriding suppression in in files now.")
		override = true;
	}
	if (typeof validated_version !== 'undefined') {
		let valid = validated_version(json);
		if (!valid) {
			console.log("================================================================================");
			console.log("File:", file);
			let errs = validated_version.errors;
			for (let e in errs) {
				let report = true;
				if (!override && 'params' in errs[e] &&  'missingProperty' in errs[e].params) {
					if (errs[e].params.missingProperty === '@USE') {
						console.log("Suppressing @USE missing property");
						report = false;
					}
				}
				if (!override && 'params' in errs[e] &&  'passingSchemas' in errs[e].params) {
					if (errs[e].params.passingSchemas === null) {
						console.log("Suppressing null passingSchemas");
						report = false;
					}
				}
				if (report) {
					error += "\r\n keyword: " + errs[e].keyword + "\r\n";
					error += " location in document: " + errs[e].instancePath + "\r\n";
					error += " message: " + errs[e].message + "\r\n";
					error += " params: " + JSON.stringify(errs[e].params) + "\r\n";
					error += " file: " + file + "\r\n";
					error += " version: " + version + "\r\n";
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
		let schema = fs.readFileSync(__dirname+"/../schemas/x3d-"+version+"-JSONSchema.json");
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
		console.error("Please specify some files to validate on the command-line, or in the validate/validateJSON function call");
		process.exit();
	}
	let file = "No file present in exception";
	for (let f in files) {
		try {
			file = files[f];
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

//alx:
//console.log('alx: '+exchangeajvmessage('should NOT have 123 then abc'));

module.exports = validateJSON

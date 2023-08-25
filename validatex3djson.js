var fs = require('fs');
const Ajv2020 = require("ajv/dist/2020");
const ajv = new Ajv2020({ strict: false });
const addFormats = require("ajv-formats");
var selectObjectFromJson = require('./selectObjectFromJson');

addFormats(ajv);

function parseErrors(errors) {
	if (errors !== null) {
		var errs = errors;
		for (var e in errs) {
			if (e == 0) {
			    console.log(e, 'Ajv '+version+' Validation failed on', file);
			}
			var error = "";
			error += "\r\n keyword: " + errs[e].keyword + "\r\n";
			var instancePath = errs[e].instancePath.replace(/^\./, "").replace(/[\.\[\]']+/g, " > ").replace(/ >[ \t]*$/, "");

			error += " instancePath: " + instancePath+ "\r\n";
			var selectedObject = selectObjectFromJson(json, instancePath);
			error += " value: " + JSON.stringify(selectedObject,
				function(k, v) {
				    var v2 = JSON.parse(JSON.stringify(v));
				    if (typeof v2 === 'object') {
					    for (var o in v2) {
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

async function validateSchema() {
	try {
	  let schema = JSON.parse(fs.readFileSync(__dirname+'/x3d-4.0-JSONSchema.json').toString());
	  let json = JSON.parse(fs.readFileSync(__dirname+"/examples.bad/HelloWorldProgramOutput2.json").toString());
	  let validate = ajv.compile(schema);
	  let result = await validate(json);
	  let valid = ajv.validate(schema, json);
	  let errors = await parseErrors(validate.errors);
	} catch (e) {
		console.error(e);
	}
}

validateSchema()

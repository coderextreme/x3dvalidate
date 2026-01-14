import Ajv2020 from "ajv/dist/2020.js";
import addFormats from "ajv-formats-draft2019";
import X3DJSONLD from './X3DJSONLD.js';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

var ajv = new Ajv2020({ strict: false });
addFormats(ajv, {mode: "full", formats: ["uri-reference", "uri", "iri-reference", "iri"], keywords: true});  // fast mode is "fast"

var CACHE = {};
CACHE.validate = {};

doValidate = function doValidate(json, validated_version, file, success, failure, e) {
	var retval = false;
	if (e) {
		if (typeof alert === 'function') {
			alert(e);
		}
		console.error(e);
	}
	if (typeof validated_version !== 'undefined') {
		var valid = validated_version(json);
		if (!valid) {
			var errs = validated_version.errors;
			var error = "";
			for (var e in errs) {
				error += "\n keyword: " + errs[e].keyword + "\n";
				var instancePath = errs[e].instancePath.replace(/^\./, "").replace(/[\.\[\]']+/g, " > ").replace(/ >[ \t]*$/, "");
	
				error += " instancePath: " + instancePath+ "\n";
				var selectedObject = X3DJSONLD.selectObjectFromJSObj(json, instancePath);
				error += " value: " + JSON.stringify(selectedObject,
					function(k, v) {
					    var v2 = structuredClone(v);
					    if (typeof v2 === 'object') {
						    for (var o in v2) {
					    		if (typeof v2[o] === 'object') {
								    v2[o] = "|omitted|";
							}
					            }
					    }
					    return v2;
					}) + "\n";
				error += " message: " + errs[e].message + "\n";
				error += " params: " + JSON.stringify(errs[e].params) + "\n";
				error += " file: " + file + "\n";
			}
		}
		if (typeof confirm !== 'function') {
			confirm = function(error) {
				return true;
			};
		}

		retval = (valid || confirm(error));
	}
	if (retval && typeof success == 'function') {
		console.log("Success validating", file);
		success();
	} else if (typeof failure === 'function') {
		failure(e);
	} else {
		console.error("User selected failure");
	}
}

function addSchema(ajv, schemajson, version) {
      var validated_version = CACHE.validate[version];
      console.log("Adding schema: ", version);
      if (typeof validated_version === 'undefined') {
          // ajv.addSchema(schemajson);
	  validated_version = ajv.compile(schemajson);
      }
      CACHE.validate[version] = validated_version;
      if (typeof validated_version === 'undefined') {
	      console.error("Schema not compiled");
      }
      return validated_version;
}

async function loadSchemaJson(version) {
  try {
	  const response = await fetch("x3d-"+version+"-JSONSchema.json");
	  const jsonData = await response.json();
	  return jsonData;
  } catch (e) {
	  alert("Failed to load schema"+e);
  }
}

export default async function loadSchema(json, file, success, failure) {
	var versions = { "4.1":true };
	var version = "4.1";
	try {
		version = json.X3D["@version"];
	} catch {
		console.log("No version found, defaulting to 4.1");
	}
	if (!versions[version]) {
		console.info("Can only validate version 4.1 presently. Switching version to 4.1.");
		version = "4.1";
	}
	var validated_version = CACHE.validate[version];
        if (typeof validated_version === 'undefined') {
		if (typeof fs === 'object') {
			var schema = fs.readFileSync(__dirname+"/x3d-"+version+"-JSONSchema.json");
			var schemajson = JSON.parse(schema.toString());
			console.log(schemajson);
			validated_version = addSchema(ajv, schemajson, version);
			doValidate(json, validated_version, file, success, undefined);
		} else {
			var schemajson = await loadSchemaJson(version);
			console.log(schemajson);
			validated_version = addSchema(ajv, schemajson, version);
			doValidate(json, validated_version, file, success, undefined);
		}
	} else {
	      doValidate(json, validated_version, file, success, undefined);
	}
}

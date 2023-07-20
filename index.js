#!/usr/bin/env node

"use strict";
const Ajv2020 = require("ajv/dist/2020");
const addFormats = require("ajv-formats");
var ajv = new Ajv2020({ strict: false });
addFormats(ajv);
var fs = require('fs');
var http = require('http');
// var jsonlint = require('@prantlf/jsonlint');
var selectObjectFromJson = require('./selectObjectFromJson');

var validate = function() { return false; }



function doValidate(json, validated_version, file, success, failure) {
	var retval = false;
	var version = json.X3D["@version"];
	var error = ""
	if (typeof validated_version !== 'undefined') {
		var valid = validated_version(json);
		if (!valid) {
			console.error("================================================================================");
			console.error("File:", file);
			var errs = validated_version.errors;
			for (var e in errs) {
				error += "\r\n keyword: " + errs[e].keyword + "\r\n";
				var instancePath = errs[e].instancePath.replace(/^\./, "").replace(/[\.\[\]']+/g, " > ").replace(/ >[ \t]*$/, "");
	
				error += " instancePath: " + instancePath+ "\r\n";
/*
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
*/
				error += " message: " + errs[e].message + "\r\n";
				error += " params: " + JSON.stringify(errs[e].params) + "\r\n";
				error += " file: " + file + "\r\n";
				error += " version: " + version + "\r\n";
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
	var versions = { "4.0":true }
	var version = json.X3D["@version"];
	if (!versions[version]) {
		console.error("Can only validate version 4.0 presently. Switching version to 4.0.");
		version = "4.0";
	}
	var validated_version = validate[version];
        if (typeof validated_version === 'undefined') {

		
		/*
		console.error("Loading meta schema");
		var metaschema = fs.readFileSync('draft-07-JSONSchema.json');
		console.error("Parsing meta schema");
		var metaschemajson = JSON.parse(metaschema.toString());
		console.error("Adding meta schema");
		ajv.addMetaSchema(metaschemajson);
		*/
		console.error("Loading schema");
		var schema = fs.readFileSync("x3d-"+version+"-JSONSchema.json");
		// var schema = fs.readFileSync("X3dXml4.0SchemaConvertedToJson2020-12Schema.json");
		console.error("Parsing schema");
		var schemajson = JSON.parse(schema.toString());
		console.error("Adding schema");
		ajv.addSchema(schemajson);
		console.error("Schema", version, "added");
		validated_version = ajv.compile(schemajson);
		validate[version] = validated_version;
		if (typeof validated_version === 'undefined') {
			console.error("Schema", version, "not compiled");
		} else {
			console.error("Schema", version, "compiled");
		}
		doValidate(json, validated_version, file, success, failure);
	} else {
		doValidate(json, validated_version, file, success, failure);
	}
}

function validateJSON(files) {

	for (var f in files) {
		var file = files[f];
		var str = fs.readFileSync(file).toString();
		if (typeof str === 'undefined') {
			throw("Read nothing, or possbile error");
		}
		try {
			var json = JSON.parse(str);
			var version = json.X3D["@version"];
			loadSchema(json, file, doValidate, function() {
				console.error("Success reading", file);
			}, function(e) {
				console.error("Error reading", file, e);

			});
		} catch (e) {
			console.error("================================================================================");
			console.error("File:", file);
			console.error(e);
		}
	}
}
function exchangeajvmessage(msg) {
        var str = fs.readFileSync("wordMap2.json").toString();
        var json = JSON.parse(str);
        var newString="";
        var object = json;
        var k=0;
        var flag=false;
        var begin,value,values=[],m=0;
        for (var i=0; i < msg.length ; i++) {
                newString+=msg[i];
                if ( newString=="" && object[newString].prototype.keys()[0]=="(*)" && !flag) {
                        object=object[newString];
                        flag=true;
                        begin=i;
                }
                if (flag) {
                        if (msg[i]==' ') {
                                newString="";
                        }
                        value+=msg[i];
                }
                if (object[newString]!=undefined) {
                        object=object[newString];
                        newString="";
                        i++;
                        k++;
                        values.push(value);
                        flag=false;
                        m=i;
                }
        }
        return object['en'] + '' + ',to stand X3D json validation requirements.'+ values[0]+ ' ' + values[1];
}

process.argv.shift();
process.argv.shift();
var files = process.argv;

if (files.length === 0) {
	console.error("Please specify some files to validate on the command-line");
} else {
	validateJSON(files);
}

//alx:
//console.log('alx: '+exchangeajvmessage('should NOT have 123 then abc'));

module.exports = validateJSON

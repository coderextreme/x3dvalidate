"use strict";
var Ajv = require('ajv');
var fs = require('fs');
var http = require('http');
var jsonlint = require('jsonlint');
var selectObjectFromJson = require('./selectObjectFromJson');
var localize = require('ajv-i18n');

var validate = function() { return false; }


var languages = {
	"en" : localize.en,
	"de" : localize.de
}

function doValidate(json, validated_version, file, success, failure, language) {
	var retval = false;
	var version = json.X3D["@version"];
	var error = ""
	var chosenLanguage = languages[language];
	if (typeof validated_version !== 'undefined') {
		var valid = validated_version(json);
		if (!valid) {
			chosenLanguage(validated_version.errors);
			console.error("================================================================================");
			console.error("File:", file);
			var errs = validated_version.errors;
			for (var e in errs) {
				error += "\r\n keyword: " + errs[e].keyword + "\r\n";
				var dataPath = errs[e].dataPath.replace(/^\./, "").replace(/[\.\[\]']+/g, " > ").replace(/ >[ \t]*$/, "");
	
				error += " dataPath: " + dataPath+ "\r\n";
				var selectedObject = selectObjectFromJson(json, dataPath);
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

function loadSchema(json, file, doValidate, success, failure, language) {
	var versions = { "3.0":true,"3.1":true,"3.2":true,"3.3":true,"3.4":true, "4.0":true }
	var version = json.X3D["@version"];
	if (!versions[version]) {
		console.error("Can only validate version 3.0-4.0 presently. Switching version to 3.3.");
		version = "3.3";
	}
	var validated_version = validate[version];
        if (typeof validated_version === 'undefined') {
		var ajv = new Ajv({ allErrors:true});
		ajv.addFormat("uri", /^(?:[a-z][a-z0-9+\-.]*:)?(?:\/?\/(?:(?:[a-z0-9\-._~!$&'()*+,;=:]|%[0-9a-f]{2})*@)?(?:\[(?:(?:(?:(?:[0-9a-f]{1,4}:){6}|::(?:[0-9a-f]{1,4}:){5}|(?:[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){4}|(?:(?:[0-9a-f]{1,4}:){0,1}[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){3}|(?:(?:[0-9a-f]{1,4}:){0,2}[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){2}|(?:(?:[0-9a-f]{1,4}:){0,3}[0-9a-f]{1,4})?::[0-9a-f]{1,4}:|(?:(?:[0-9a-f]{1,4}:){0,4}[0-9a-f]{1,4})?::)(?:[0-9a-f]{1,4}:[0-9a-f]{1,4}|(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?))|(?:(?:[0-9a-f]{1,4}:){0,5}[0-9a-f]{1,4})?::[0-9a-f]{1,4}|(?:(?:[0-9a-f]{1,4}:){0,6}[0-9a-f]{1,4})?::)|[Vv][0-9a-f]+\.[a-z0-9\-._~!$&'()*+,;=:]+)\]|(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?)|(?:[a-z0-9\-._~!$&'()*+,;=]|%[0-9a-f]{2})*)(?::\d*)?(?:\/(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})*)*|\/(?:(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})+(?:\/(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})*)*)?|(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})+(?:\/(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})*)*)?(?:\?(?:[a-z0-9\-._~!$&'()*+,;=:@\/?]|%[0-9a-f]{2})*)?(?:\#(?:[a-z0-9\-._~!$&'()*+,;=:@\/?]|%[0-9a-f]{2})*)?$/i);

		
		console.error("Loading meta schema");
		var metaschema = fs.readFileSync('draft-04-JSONSchema.json');
		console.error("Parsing meta schema");
		var metaschemajson = JSON.parse(metaschema.toString());
		console.error("Adding meta schema");
		ajv.addMetaSchema(metaschemajson);
		console.error("Loading schema");
		var schema = fs.readFileSync("x3d-"+version+"-JSONSchema.json");
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
		doValidate(json, validated_version, file, success, failure, language);
	} else {
		doValidate(json, validated_version, file, success, failure, language);
	}
}

function validateJSON(language, files) {

	for (var f in files) {
		var file = files[f];
		var str = fs.readFileSync(file).toString();
		if (typeof str === 'undefined') {
			throw("Read nothing, or possbile error");
		}
		try {
			var json = jsonlint.parse(str);
			var version = json.X3D["@version"];
			loadSchema(json, file, doValidate, function() {
				console.error("Success reading", file);
			}, function(e) {
				console.error("Error reading", file, e);

			}, language);
		} catch (e) {
			console.error("================================================================================");
			console.error("File:", file);
			console.error(e);
		}
	}
}
function exchangeajvmessage(msg) {
        var str = fs.readFileSync("wordMap2.json").toString();
        var json = jsonlint.parse(str);
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
//alx:
//console.log('alx: '+exchangeajvmessage('should NOT have 123 then abc'));

module.exports = validateJSON

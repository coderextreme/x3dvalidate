var fs = require('fs');
var jsonlint = require('jsonlint');
var http = require('http');

var validate = {};

var Ajv = require('ajv');

function loadSchema(json, file) {
	var versions = { "3.0":true,"3.1":true,"3.2":true,"3.3":true,"3.4":true, "4.0":true }
	var version = json.X3D["@version"];
	if (!versions[version]) {
		console.error("Can only validate version 3.0-4.0 presently. Switching version to 3.3.");
		version = "3.3";
	}
        if (typeof validate[version] === 'undefined') {
		var schema = fs.readFileSync(__dirname+"/x3d-"+version+"-JSONSchema.json").toString();
		var ajv = new Ajv({ allErrors:true});
		ajv.addFormat("uri", /^(?:[a-z][a-z0-9+\-.]*:)?(?:\/?\/(?:(?:[a-z0-9\-._~!$&'()*+,;=:]|%[0-9a-f]{2})*@)?(?:\[(?:(?:(?:(?:[0-9a-f]{1,4}:){6}|::(?:[0-9a-f]{1,4}:){5}|(?:[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){4}|(?:(?:[0-9a-f]{1,4}:){0,1}[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){3}|(?:(?:[0-9a-f]{1,4}:){0,2}[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){2}|(?:(?:[0-9a-f]{1,4}:){0,3}[0-9a-f]{1,4})?::[0-9a-f]{1,4}:|(?:(?:[0-9a-f]{1,4}:){0,4}[0-9a-f]{1,4})?::)(?:[0-9a-f]{1,4}:[0-9a-f]{1,4}|(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?))|(?:(?:[0-9a-f]{1,4}:){0,5}[0-9a-f]{1,4})?::[0-9a-f]{1,4}|(?:(?:[0-9a-f]{1,4}:){0,6}[0-9a-f]{1,4})?::)|[Vv][0-9a-f]+\.[a-z0-9\-._~!$&'()*+,;=:]+)\]|(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?)|(?:[a-z0-9\-._~!$&'()*+,;=]|%[0-9a-f]{2})*)(?::\d*)?(?:\/(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})*)*|\/(?:(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})+(?:\/(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})*)*)?|(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})+(?:\/(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})*)*)?(?:\?(?:[a-z0-9\-._~!$&'()*+,;=:@\/?]|%[0-9a-f]{2})*)?(?:\#(?:[a-z0-9\-._~!$&'()*+,;=:@\/?]|%[0-9a-f]{2})*)?$/i);

		
		http.get('http://json-schema.org/draft-04/schema', (res) => {
		  const { statusCode } = res;
		  const contentType = res.headers['content-type'];

		  var error;
		  if (statusCode !== 200) {
		    error = new Error(`Request Failed.\n` +
				      `Status Code: ${statusCode}`);
		  } else if (!/^application\/octet-stream/.test(contentType)) {
		    error = new Error(`Invalid content-type.\n` +
				      `Expected application/json but received ${contentType}`);
		  }
		  if (error) {
		    console.error(error.message);
		    // consume response data to free up memory
		    res.resume();
		    return;
		  }

		  res.setEncoding('utf8');
		  var rawData = '';
		  res.on('data', (chunk) => { rawData += chunk; });
		  res.on('end', () => {
		    try {
		      console.log("MetaSchema received");
		      var metaschemajson = jsonlint.parse(rawData);
		      ajv.addMetaSchema(metaschemajson);
		      console.log("MetaSchema added");
		      var schemajson = jsonlint.parse(schema);
		      console.log("Schema", version, "parsed");
		      ajv.addSchema(schemajson);
		      console.log("Schema", version, "added");
		      validate[version] = ajv.compile(schemajson);
		      if (typeof validate[version] !== 'undefined') {
			      console.log("Schema compiled");
		      } else {
			      console.log("Schema not compiled");
		      }
		      doValidate(json, file);
		    } catch (e) {
		      console.error(e.message);
		    }
		  });
		}).on('error', (e) => {
		  console.error(`Got error: ${e.message}`);
		});
	}
}

function doValidate(json, file) {
	var version = json.X3D["@version"];
	if (typeof validate[version] !== 'undefined') {
		var valid = validate[version](json);
		if (!valid) {
			var errs = validate[version].errors;
			var error = ""
			for (var e in errs) {
				error += "\r\n dataPath: " + errs[e].dataPath + "\r\n";
				error += " message: " + errs[e].message + "\r\n";
				error += " params: " + JSON.stringify(errs[e].params) + "\r\n";
				error += " file: " + file + "\r\n";
			}
			if (error !== "") {
				console.error(error);
			}
		}
	}
}

function validateJSON(files) {

	for (var f in files) {
		var file = files[f];
		try {  
			var str = fs.readFileSync(file).toString();
			if (typeof str === 'undefined') {
				throw("Read nothing, or possbile error");
			}
			var json = jsonlint.parse(str);
			var version = json.X3D["@version"];
			if (!validate[version]) {
				loadSchema(json, file);  // loads schema.
			} else {
				doValidate(json, file);
			}
				
		} catch (e) {
			console.error("Error reading", file, e);
		}
	}
}


module.exports = validateJSON

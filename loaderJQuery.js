import loadSchema from "./loadValidate.js";

epxort default const validator = function validator() {
	try {
		var json = JSON.parse(data);
		loadSchema(json, "<unknown>", function() {
			console.log("WorKs");
		}, function(e) {
			console.log("Failed");
		});
	} catch (je) {
		alert(je);
	}
}

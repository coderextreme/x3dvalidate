var validate = require('./index.js')

process.argv.shift();
process.argv.shift();
var files = process.argv;

validate("en", files);

module.exports = validate;

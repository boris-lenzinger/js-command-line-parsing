var parser = require("./lib-parsing.js");

var pathToParameterFile = process.argv[2];
if ( pathToParameterFile !== undefined ) {
    parser.defineParameters(process.argv[2]);
} else {
    parser.defineParameters("./parameters.json");
}

console.log(parser.libraryAvailableParameters);

var parameters = parser.parse(['--path-to-file', '/tmp/tokenized-file', 'isolatedValue', '--token', 'name', '--value', 'replacement', '--replace-first-only', 'anotherIsolatedValue']);

console.log(parameters);
console.log("=====================================");

// Supply your own parsing parameters
var customParameters = {
    "otherParameter": {
	"doc": "The documentation of the new parameter",
	"longOption": "--new-option"
    }
};

parameters = parser.parse(['--new-option', 'valueOfOption', 'stillAnIsolatedValue'], customParameters);

console.log(parameters);

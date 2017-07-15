var fs = require("fs");

var lib = fs.readFileSync("./lib-parsing.js", "utf8");
eval(lib);

var pathToParameterFile = process.argv[2];
if ( pathToParameterFile !== undefined ) {
    defineParameters(process.argv[2]);
} else {
    defineParameters("./parameters.json");
}

var parameters = parse(['--path-to-file', '/tmp/tokenized-file', 'isolatedValue', '--token', 'name', '--value', 'replacement', '--replace-first-only', 'anotherIsolatedValue']);

console.log(parameters);
console.log("=====================================");

// Supply your own parsing parameters
var customParameters = {
    "otherParameter": {
	"doc": "The documentation of the new parameter",
	"longOption": "--new-option"
    }
};

parameters = parse(['--new-option', 'valueOfOption', 'stillAnIsolatedValue'], customParameters);

console.log(parameters);

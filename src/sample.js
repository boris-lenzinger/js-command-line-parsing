var parser = require("./lib-parsing.js");


console.log("*************************************");
console.log("Defines global parameters.");
var pathToParameterFile = process.argv[2];
var parametersAndLocalParsing;

if ( pathToParameterFile !== undefined ) {
    parametersAndLocalParsing = parser.defineGlobalParameters(process.argv[2]);
} else {
    parametersAndLocalParsing = parser.defineGlobalParameters("./parameters.json");
}

console.log(parser.libraryAvailableParameters);
console.log("");


console.log("*************************************");
console.log("Picks parameters.");
var listSupported = [ 'filepath', 'tokenName' ];
var localParameters = parametersAndLocalParsing;

localParameters = localParameters.pickOptions(listSupported);
console.log(localParameters);
console.log("");

console.log("*************************************");
console.log("Catches exception when picking unknown parameter.");
localParameters = parametersAndLocalParsing;
listSupported = [ 'filepath', 'tokenName', 'unknown' ];
try {
    localParameters = localParameters.pickOptions(listSupported);
} catch (e) {
    console.log("Exception caught : " + e);
}
console.log("");


console.log("*************************************");
console.log("Marks parameter as mandatory");
localParameters = parametersAndLocalParsing;
var mandatory = [ 'filepath' ];
localParameters = localParameters.markOptionsAsMandatory(mandatory);
console.log(localParameters);
console.log("");


console.log("*************************************");
console.log("Overrides the parameter documentation");
localParameters = parametersAndLocalParsing;
localParameters = localParameters.overrideDocumentation('filepath', 'The relative path to the file');
console.log(localParameters);
console.log("");


console.log("*************************************");
console.log("Parsing command line with mandatory parameters");
localParameters = parametersAndLocalParsing;
localParameters = localParameters.parse(['--path-to-file', '/tmp/tokenized-file', 'isolatedValue', '--token', 'name', '--value', 'replacement', '--replace-first-only', 'anotherIsolatedValue']);

console.log(localParameters);
console.log("");


console.log("*************************************");
console.log("Supplying custom parameters.");
// Supply your own parsing parameters
var customParameters = {
    "otherParameter": {
	"doc": "The documentation of the new parameter",
	"longOption": "--new-option"
    }
};
localParameters.list = customParameters;
localParameters = localParameters.parse(['--new-option', 'valueOfOption', 'stillAnIsolatedValue']);
console.log(localParameters);
console.log("");


console.log("*************************************");
console.log("Using default values in the parser. An exception must be raised.");
localParameters = parametersAndLocalParsing;
try {
    localParameters = localParameters.parse(['--new-option', 'valueOfOption', 'stillAnIsolatedValue']);
} catch (e) {
    console.log("Exception caught : ", JSON.stringify(e));
}
console.log("");


console.log("*************************************");
console.log("Displaying help with a mandatory parameter.");
localParameters = parametersAndLocalParsing;
listSupported = [ 'filepath', 'tokenName' ];
mandatory = [ 'filepath' ];
localParameters.pickOptions(listSupported).
    markOptionsAsMandatory(mandatory).
    generateDocumentation(parametersAndLocalParsing);
console.log("");


console.log("*************************************");
console.log("Generate the documentation of a script.");
localParameters = parametersAndLocalParsing;
var documentation = {};
documentation.header = "Header of the documentation of the script.";
documentation.postDoc = "The post doc of the script.";
documentation.syntaxExamples = "Some samples of the syntax of the script.";
parser.generateScriptDocumentation(localParameters, documentation);

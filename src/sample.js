var parser = require("./lib-parsing.js");


console.log("*************************************");
console.log("Defining global parameters.");
var pathToParameterFile = process.argv[2];
if ( pathToParameterFile !== undefined ) {
    parser.defineGlobalParameters(process.argv[2]);
} else {
    parser.defineGlobalParameters("./parameters.json");
}

console.log(parser.libraryAvailableParameters);
console.log("");


console.log("*************************************");
console.log("Picking parameters.");
var listSupported = [ 'filepath', 'tokenName' ];
var parametersAndLocalParsing = parser.pickParameters(listSupported);
console.log(parametersAndLocalParsing);
console.log("");

console.log("*************************************");
console.log("Catching exception when picking unknown parameter.");
listSupported = [ 'filepath', 'tokenName', 'unknown' ];
try {
    parametersAndLocalParsing = parser.pickParameters(listSupported);
} catch (e) {
    console.log("Exception caught : " + e);
}
console.log("");


console.log("*************************************");
console.log("Mark parameter as mandatory");
var mandatory = [ 'filepath' ];
parametersAndLocalParsing = parser.markParametersAsMandatory(parametersAndLocalParsing, mandatory);
console.log(parametersAndLocalParsing);
console.log("");


console.log("*************************************");
console.log("Overrides the parameter documentation");
parametersAndLocalParsing = parser.overrideDocumentationOfElement(parametersAndLocalParsing, 'filepath', 'The relative path to the file');
console.log(parametersAndLocalParsing);
console.log("");


console.log("*************************************");
var parameters = parser.parse(['--path-to-file', '/tmp/tokenized-file', 'isolatedValue', '--token', 'name', '--value', 'replacement', '--replace-first-only', 'anotherIsolatedValue'], parametersAndLocalParsing);

console.log(parameters);
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
parametersAndLocalParsing = {}
parametersAndLocalParsing.supported = customParameters;
parameters = parser.parse(['--new-option', 'valueOfOption', 'stillAnIsolatedValue'], parametersAndLocalParsing);
console.log(parameters);
console.log("");


console.log("*************************************");
console.log("Using default values in the parser. An exception must be raised.");
try {
    parameters = parser.parse(['--new-option', 'valueOfOption', 'stillAnIsolatedValue']);
} catch (e) {
    console.log("Exception caught : ", JSON.stringify(e));
}
console.log("");


console.log("*************************************");
console.log("Displaying help with a mandatory parameter.");
listSupported = [ 'filepath', 'tokenName' ];
parametersAndLocalParsing = parser.pickParameters(listSupported);
mandatory = [ 'filepath' ];
parametersAndLocalParsing = parser.markParametersAsMandatory(parametersAndLocalParsing, mandatory);
parser.generateParametersDocumentation(parametersAndLocalParsing);
console.log("");


console.log("*************************************");
console.log("Generate the documentation of a script.");
var documentation = {};
documentation.header = "Header of the documentation of the script.";
documentation.postDoc = "The post doc of the script.";
documentation.syntaxExamples = "Some samples of the syntax of the script.";
parser.generateScriptDocumentation(parametersAndLocalParsing, documentation);

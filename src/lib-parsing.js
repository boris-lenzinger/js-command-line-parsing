var fs = require('fs');

var exports = module.exports={};

exports.libraryAvailableParameters = {};

exports.defineParameters = function(pathToParametersFile) {
    exports.libraryAvailableParameters = JSON.parse(fs.readFileSync(pathToParametersFile, 'utf8'));
}

// Now we can parse to build a parameter object.
exports.parse = function(arguments, availableParameters) {
    if ( availableParameters == undefined ) {
	availableParameters = exports.libraryAvailableParameters;
    }
    
    var parameters = {};
    var isParameter = false;


    for ( var i = 0; i < arguments.length; i++ ) {
	var parameter = arguments[i];
	var definitionOfOption = exports.getOptionDefinition(availableParameters, parameter)
	// Get the name of the parameter
	if ( typeof definitionOfOption.name !== 'undefined' ) {
	    var value = undefined;
	    var isFlag = /^flag.*/;
	    if ( isFlag.test(definitionOfOption.name)  ) {
		value = true;
	    } else {
		value = arguments[i+1];
		i = i + 1;
	    }
	    parameters[definitionOfOption.name] = value;
	} else {
	    // Handling parameters that do not have dedicated option
	    // and storing them in a dedicated array
	    if ( parameters['_unassigned'] == undefined ) {
		parameters['_unassigned'] = [ parameter ];
	    } else {
		parameters['_unassigned'].push(parameter);
	    }
	}
    }
    return parameters;
}



exports.getOptionDefinition = function(availableParameters, parameter) {
    var definition = {};
    for ( var candidate in availableParameters ) {
	var shortOption = availableParameters[candidate].shortOption;
	var longOption = availableParameters[candidate].longOption;
	if ( shortOption == parameter || longOption == parameter ) {
	    definition = availableParameters[candidate];
	    definition.name = candidate;
	    break;
	}
    }

    return definition;
}




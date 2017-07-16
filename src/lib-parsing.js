var fs = require('fs');

var exports = module.exports={};

exports.libraryAvailableParameters = {};

/**
 * Function to ingest the file defining the parameters for the parsing.
 * The parsing is done, by default with the parameters that are supplied
 * to this function.
 */
exports.defineParameters = function(pathToParametersFile) {
    exports.libraryAvailableParameters = JSON.parse(fs.readFileSync(pathToParametersFile, 'utf8'));
}


/**
 * Parses the command line passed as parameter. The function uses, by default the parameters
 * passed to the function 'defineParameters'. But you can pass your own set of parameters
 * and they will be used to make the parsing.
 *
 * @return : the function returns a parameter object where the field name is the parameter
 * name as specified in the object availableParameters. The value stored for the field is the
 * value parsed by the function.
 */
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


/**
 * This function finds the definition of a parameter in the list of the
 * available parameters.
 * This function is used in the parsing function. It is currently exposed
 * but it might changed and not be anymore exported in a near future.
 */
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




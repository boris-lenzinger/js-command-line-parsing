var fs = require('fs');

var exports = module.exports={};

exports.Options = function(pathToParametersFile, encodingOfFile) {
	if ( encodingOfFile === undefined ) {
		encodingOfFile = 'utf8';
	}
	if ( pathToParametersFile !== undefined ) {
		this.list = JSON.parse(fs.readFileSync(pathToParametersFile, encodingOfFile));
	} else {
		this.list = {};
	}
}


exports.libraryAvailableParameters = new exports.Options();

/**
 * Function to ingest the file defining all the parameters that you want to
 * support in any of your scripts. This ensures the consistency in the naming of
 * the options for all the scripts you will write. 
 */
exports.defineGlobalParameters = function(pathToParametersFile, encodingOfFile) {
    exports.libraryAvailableParameters = new exports.Options(pathToParametersFile, encodingOfFile);
    return exports.libraryAvailableParameters;
}


/**
 * This function picks the parameters that you want to support for your script.
 * It picks the different elements and contributes to create the object that you
 * you will pass to the parser of the command line arguments.
 * @param listOfSupportedParameters : a string array with the name of the parameters as
 * supplied in the definition of the parameters.
 */
exports.Options.prototype.pickOptions = function(listOfSupportedParameters) {
    var parametersAndLocalParsing = new exports.Options();
    parametersAndLocalParsing.list = {};

    if ( listOfSupportedParameters !== undefined ) {
	for ( var i in listOfSupportedParameters ) {
	    var defOfParameter = this.list[listOfSupportedParameters[i]];
	    if ( defOfParameter !== undefined ) {
		parametersAndLocalParsing.list[listOfSupportedParameters[i]] = defOfParameter;
	    } else {
		var message = 'Parameter '+listOfSupportedParameters[i]+' is not in the list of the supported parameters.';
		throw new Error(message);
	    }
	}
    }

    return parametersAndLocalParsing;
}


/**
 * This function allows you to override the general documentation of the option to put
 * the most relevant documentation for this specific case.
 * @param parametersAndLocalParsing : the parameter that will be used for parsing the command line
 * of your script.
 * @param parameterName : the name of the parameter for which you want to override the documentation.
 * @param newDocumentation : the new content of the documentation.
 * @return : the object you have applied the method to. If the parameter is not found, an error is thrown.
 */
exports.Options.prototype.overrideDocumentation = function(parameterName, newDocumentation) {
    if ( this.list[parameterName] !== undefined ) {
	this.list[parameterName].doc = newDocumentation;
    } else {
	throw new Error('Parameter "'+parameterName+'" was not found. Cannot override the documentation.');
    }

    return this;
}


/**
 * This function allows you to override the default value of the option.
 *
 * @param parametersAndLocalParsing : the parameter that will be used for parsing the command line
 * of your script.
 * @param parameterName : the name of the parameter for which you want to override the default value.
 * @param newValue : the new default value for this option.
 * @return : the object you have applied the method to. If the parameter is not found, an error is thrown.
 */
exports.Options.prototype.overrideDefaultValue = function(parameterName, newValue) {
    if ( this.list[parameterName] !== undefined ) {
	this.list[parameterName].value = newValue;
    } else {
	throw new Error('Parameter "'+parameterName+'" was not found. Cannot override the value.');
    }

    return this;
}


/**
 * Marks some parameters used for the parsing as mandatory parameters.
 * @param parametersAndLocalParsing : the parameter used to parse the command line of the script
 * @param mandatoryParameters : the parameters we want to define as mandatory parameter. This is a string array.
 * @return the parametersAndLocalParsing object passed as parameter enrichied with a property
 * isMandatory for the parameters that must be defined as this.
 */
exports.Options.prototype.markOptionsAsMandatory = function(mandatoryParameters) {
    if ( mandatoryParameters !== undefined ) {
	for ( var i in mandatoryParameters ) {
	    var paramName = mandatoryParameters[i];
	    if ( this.list[paramName] !== undefined ) {
		this.list[paramName].isMandatory = true;
	    } else {
		throw new Error('Cannot find parameter "'+paramName+'". Cannot mark set it as mandatory.');
	    }
	}
    }
    return this;
}


/**
 * Generates only the documentation for the parameters. This lets you generate the documentation
 * of the script you are writing in a quite free way. Check the function generateScriptDocumentation
 * if you want a predefined model of documentation for a script.
 * @return an array storing the documentation for each supported option.
 */
exports.Options.prototype.generateParametersDocumentation = function() {
    var parameters = {}
    if ( this.list !== undefined ) {
	parameters = this.list;
    } else {
	parameters = exports.libraryAvailableParameters.list;
    }

    var longest = exports.getLengthOfLonguestOption(parameters);
    // This is the number of spaces between the option and the documentation
    // of the option
    var nbOfSpaces = 1;

    // The documentation is built in multiple steps : the script documentation,
    // the options documentation, then the post documentation of the script and
    // the syntax examples.
    var documentation = [];

    for ( var item in parameters ) {
	var description = parameters[item];
	var lengthOfTheOption = description.longOption.length;
	var docOfOption = description.longOption + exports.getSpaces(longest - lengthOfTheOption + nbOfSpaces);
	if ( description.isMandatory === true ) {
	    docOfOption += '(M) ';
	} else {
	    docOfOption += '    ';
	}
	documentation.push(docOfOption + description.doc);
    }
    documentation.sort();

    return documentation;
}


/**
 * Build a string composed with a repetition of spaces specified as parameter.
 */
exports.getSpaces = function(number) {
    var spaces = "";
    for ( var i = 1; i <= number; i++ ) {
	spaces += " ";
    }
    return spaces;
}


/**
 * Computes the maximum length of the long option field of each parameter.
 * @param descriptionOfOptions : all the descriptions of the options as JSON object.
 * @return the maximum length. Zero if the parameter passed is undefined.
 */
exports.getLengthOfLonguestOption = function(descriptionOfOptions) {
    var longest = 0;
    if ( descriptionOfOptions !== undefined ) {
	for ( var item in descriptionOfOptions ) {
	    var description = descriptionOfOptions[item];
	    if ( description !== undefined && description.longOption !== undefined ) {
		longest = Math.max(longest, description.longOption.length);
	    }
	}
    }

    return longest;
}


/**
 * @param scriptDocumentation : an object that stores different section of the documentation of
 * the script. Mainly, we distinguish the header/introduction, the post-documentation and syntax
 * examples. Here are the fields that stores the different items :
 *  - header
 *  - postDoc
 *  - syntaxExamples
 */
exports.generateScriptDocumentation = function(parametersAndLocalParsing, scriptDocumentation) {
    if ( scriptDocumentation !== undefined && scriptDocumentation.header !== undefined ) {
	console.log("Documentation");
	console.log("=============");
	console.log(scriptDocumentation.header);
	console.log("");
    }

    if ( parametersAndLocalParsing.list !== undefined ) {
	var documentation = parametersAndLocalParsing.generateParametersDocumentation();

	for ( var i in documentation ) {
	    console.log(documentation[i]);
	}
	console.log("");
    }

    if ( scriptDocumentation !== undefined && scriptDocumentation.postDoc !== undefined ) {
	console.log(scriptDocumentation.postDoc);
	console.log("");
    }

    if ( scriptDocumentation !== undefined && scriptDocumentation.syntaxExamples !== undefined ) {
	console.log("Examples of syntax :");
	console.log("====================");
	console.log(scriptDocumentation.syntaxExamples);
    }

}


/**
 *
 */
exports.generateJSONScriptDocumentation = function(parametersAndLocalParsing, scriptDocumentation) {
    var json = {};
    if ( scriptDocumentation !== undefined && scriptDocumentation.header !== undefined ) {
	json.header = scriptDocumentation.header;
    }

    if ( parametersAndLocalParsing.list !== undefined ) {
	json.options = parametersAndLocalParsing.generateParametersDocumentation();
    }

    if ( scriptDocumentation !== undefined && scriptDocumentation.postDoc !== undefined ) {
	json.postDoc = scriptDocumentation.postDoc;
    }

    if ( scriptDocumentation !== undefined && scriptDocumentation.syntaxExamples !== undefined ) {
	json.syntaxExamples = scriptDocumentation.syntaxExamples;
    }
    return json;
}



/**
 * Parses the command line passed as parameter. The function uses, by default the parameters
 * passed to the function 'defineParameters'. But you can pass your own set of parameters
 * and they will be used to make the parsing.
 * @param arguments : the content of the command line as an array of strings.
 * @param parametersAndLocalParsing : all the details about the parameters that we support
 * and the parameters that are known for the parsing. The object has the following element for
 * the different :
 *  - list 
 *  - localParsing : this is a special item. This is a function that offers to handle the
 *    unnamed parameters in a different way.
 * If a parameter is not in the supported list AND the local parsing rejects it, then an
 * exception is thrown. The default local parsing function is to reject any isolated value.
 *
 * @return : the function returns a parameter object where the field name is the parameter
 * name as specified in the object availableParameters. The value stored for the field is the
 * value parsed by the function.
 */
exports.Options.prototype.parse = function(arguments) {
    if ( this.list == undefined ) {
	availableParameters = exports.libraryAvailableParameters;
    } else {
	availableParameters = this.list;
    }

    var mandatoryParameters = {};
    for ( var parameter in availableParameters ) {
	var definition = availableParameters[parameter];
	if ( definition.isMandatory == true ) {
	    mandatoryParameters[parameter] = definition;
	}
    }

    var parameters = new exports.Options();
    var isParameter = false;

    for ( var i = 0; i < arguments.length; i++ ) {
	var parameter = arguments[i];
	var definitionOfOption = exports.getOptionDefinition(availableParameters, parameter)
	// Get the name of the parameter
	if ( typeof definitionOfOption.name !== 'undefined' ) {
	    var value = undefined;
	    var isFlag = /^flag.*/;
	    if ( isFlag.test(definitionOfOption.name) ) {
		value = true;
	    } else {
		value = arguments[i+1];
		i = i + 1;
	    }
	    parameters.list[definitionOfOption.name] = value;
	} else {
	    // Handling parameters that do not have dedicated option
	    // and storing them in a dedicated array
	    if ( parameters['_unassigned'] === undefined ) {
		parameters['_unassigned'] = [ parameter ];
	    } else {
		parameters['_unassigned'].push(parameter);
	    }
	}
    }

    var missingParameters = [];
    for ( var mandatory in mandatoryParameters ) {
	if ( parameters.list[mandatory] === undefined ) {
	    missingParameters.push(mandatoryParameters[mandatory].longOption);
	}
    }
    if ( missingParameters.length > 0 ) {
	console.error("The following options are mandatory but are missing :");
	for ( var missing in missingParameters ) {
	    console.error(" *", missingParameters[missing]);
	}
	throw new Error("Missing mandatory parameters.");
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




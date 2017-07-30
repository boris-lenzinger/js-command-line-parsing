var parser = require('../src/lib-parsing.js');


describe("Parsing of a parameters file", function() {

    beforeEach(function() {
	parser.defineGlobalParameters("src/parameters.json");
    });


    it("Checking that the definition of parameters is loaded.", function() {
	expect(parser.libraryAvailableParameters).toBeDefined();
    });
    
    
    it("Checking that the content of the parameters definition is ok.", function() {
	expect(parser.libraryAvailableParameters.list['filepath']).toBeDefined();
	expect(parser.libraryAvailableParameters.list['tokenName']).toBeDefined();
	expect(parser.libraryAvailableParameters.list['tokenValue']).toBeDefined();
	expect(parser.libraryAvailableParameters.list['flagReplaceFirstOnly']).toBeDefined();
    });

    
    it("Checking that the content of the filepath definition is ok.", function() {
	expect(parser.libraryAvailableParameters.list['filepath'].doc).toBeDefined();
	expect(parser.libraryAvailableParameters.list['filepath'].longOption).toBeDefined();
	expect(parser.libraryAvailableParameters.list['filepath'].longOption).toEqual('--path-to-file');
	
    });

    
    it("Checking that the content of the tokenName definition is ok.", function() {
	expect(parser.libraryAvailableParameters.list['tokenName'].doc).toBeDefined();
	expect(parser.libraryAvailableParameters.list['tokenName'].longOption).toBeDefined();
	expect(parser.libraryAvailableParameters.list['tokenName'].longOption).toEqual('--token');
	
    });

    
    it("Checking that the content of the tokenValue definition is ok.", function() {
	expect(parser.libraryAvailableParameters.list['tokenValue'].doc).toBeDefined();
	expect(parser.libraryAvailableParameters.list['tokenValue'].longOption).toBeDefined();
	expect(parser.libraryAvailableParameters.list['tokenValue'].longOption).toEqual('--value');
	
    });

    
    it("Checking that the content of the flagReplaceFirstOnly definition is ok.", function() {
	expect(parser.libraryAvailableParameters.list['flagReplaceFirstOnly'].doc).toBeDefined();
	expect(parser.libraryAvailableParameters.list['flagReplaceFirstOnly'].longOption).toBeDefined();
	expect(parser.libraryAvailableParameters.list['flagReplaceFirstOnly'].value).toBeDefined();
	expect(parser.libraryAvailableParameters.list['flagReplaceFirstOnly'].value).toBe(false);
	
    });

});


// =========================================================
describe('Parameters picking', function() {
    var options;
 
    beforeEach(function() {
	var supported = [ 'filepath', 'tokenName', 'tokenValue' ];
	options = parser.defineGlobalParameters("src/parameters.json").
		pickOptions(supported);
    });
    
    it('Picking parameters', function() {
	expect(options.list).toBeDefined();
	expect(options.list['filepath']).toBeDefined();
	expect(options.list['tokenName']).toBeDefined();
	expect(options.list['tokenValue']).toBeDefined();
	expect(options.list['flagReplaceFirstOnly']).toBeUndefined();
    });


    it('Picking unknown option must raise an exception', function() {
	var supported = [ 'unknownOption' ];
	var exception;

	try {
	    options = parser.defineGlobalParameters("src/parameters.json").
		pickOptions(supported);
	} catch (e) {
	    exception = e;
	}
	expect(exception).toBeDefined();
    });

});


// =========================================================
describe('Setting parameters as mandatory', function() {
    var options;

    beforeEach(function() {
	var supported = [ 'filepath', 'tokenName', 'tokenValue' ];
	var mandatory = [ 'filepath' ];
	options = parser.defineGlobalParameters("src/parameters.json").
		pickOptions(supported).
		markOptionsAsMandatory(mandatory);
    });

    it('Detecting the parameter as mandatory.', function() {
	expect(options).toBeDefined();
	expect(options.list['filepath']).toBeDefined();
	expect(options.list['filepath'].isMandatory).toBe(true);
    });

    it('Setting unknown option as mandatory must raise an exception.', function() {
	var exception;
	var mandatory = [ 'unknownOption' ];
	try {
	    options = parser.defineGlobalParameters("src/parameters.json").
		markOptionsAsMandatory(mandatory);
	} catch (e) {
	    exception = e;
	}
	    
	expect(exception).toBeDefined();
    });

});


// =========================================================
describe('Checking that parsing assigns the good values', function() {
 
    it("Passing a valid command line", function() {
	var options = parser.defineGlobalParameters("src/parameters.json").
		pickOptions(['filepath', 'tokenName', 'tokenValue', 'flagReplaceFirstOnly']);
	var parameters = options.parse(['--path-to-file', '/tmp/tokenized-file', 'isolatedValue', '--token', 'name', '--value', 'replacement', '--replace-first-only', 'anotherIsolatedValue']);
	expect(parameters).toBeDefined();
	expect(parameters.list).toBeDefined();
	expect(parameters.list['filepath']).toBe('/tmp/tokenized-file');
	expect(parameters.list['tokenName']).toBe('name');
	expect(parameters.list['tokenValue']).toBe('replacement');
	expect(parameters.list['flagReplaceFirstOnly']).toBe(true);
	expect(parameters['_unassigned']).toBeDefined();
	expect(parameters['_unassigned'].length).toBe(2);
	expect(parameters['_unassigned'][0]).toBe('isolatedValue');
	expect(parameters['_unassigned'][1]).toBe('anotherIsolatedValue');
    });


    it('Parsing with restricted set of options.', function() {
	var options = parser.defineGlobalParameters("src/parameters.json").
		pickOptions(['filepath', 'tokenName', 'tokenValue']);
	var parameters = options.parse(['--path-to-file', '/tmp/tokenized-file', 'isolatedValue', '--token', 'name', '--value', 'replacement', '--replace-first-only', 'anotherIsolatedValue'], options);
	expect(parameters.list['filepath']).toBe('/tmp/tokenized-file');
	expect(parameters.list['tokenName']).toBe('name');
	expect(parameters.list['tokenValue']).toBe('replacement');
	expect(parameters.list['flagReplaceFirstOnly']).toBeUndefined();
	expect(parameters['_unassigned']).toBeDefined();
	expect(parameters['_unassigned'].length).toBe(3);
	expect(parameters['_unassigned'][0]).toBe('isolatedValue');
	expect(parameters['_unassigned'][1]).toBe('--replace-first-only');
	expect(parameters['_unassigned'][2]).toBe('anotherIsolatedValue');
	
    });

    it('Parsing with mandatory set of options but one mandatory is missing must raise an exception.', function() {
	var mandatory = [ 'filepath' ];
	var options = parser.defineGlobalParameters("src/parameters.json").
	    pickOptions(['filepath', 'tokenName', 'tokenValue']).
	    markOptionsAsMandatory(mandatory);	

	var exception;
	try {
	    options.parse(['isolatedValue', '--token', 'name', '--value', 'replacement', '--replace-first-only', 'anotherIsolatedValue'], options);
	} catch (e) {
	    exception = e;
	}
	expect(exception).toBeDefined();
	
    });

});


// ==========================================================
describe('Override of options', function() {

    it('Documentation', function() {
	var newDocumentation = 'New documentation for filepath option.';
	var options = parser.defineGlobalParameters("src/parameters.json").
	    overrideDocumentation('filepath', newDocumentation);
	expect(options.list['filepath'].doc).toBe(newDocumentation);
    });
       
    it('Parameters', function() {
	var newDefaultValue = '/usr/local/bin';
	var options = parser.defineGlobalParameters("src/parameters.json").
	    overrideDefaultValue('filepath', newDefaultValue);
	expect(options.list['filepath'].value).toBe(newDefaultValue);
    });
       
});



// ==========================================================
describe('Documentation Generation', function() {

    it('Parameters', function() {
    });

});


// ==========================================================
describe('Testing internal functions', function() {

    it("GetSpaces", function() {
	var output = parser.getSpaces(5);
	expect(output).toBe('     ');
	output = parser.getSpaces(0);
	expect(output).toBe('');
    });

    it("getLengthOfLonguestOption", function() {
	var options = undefined;
	expect(parser.getLengthOfLonguestOption(options)).toBe(0);
	options = {};
	expect(parser.getLengthOfLonguestOption(options)).toBe(0);
	options = { list: { 'a': { longOption: '--a'}, 'aaaa': {longOption: '--aaaa'}, 'aa': {longOption: '--aa'} } };
	expect(parser.getLengthOfLonguestOption(options.list)).toBe('--aaaa'.length);
    })
    
});



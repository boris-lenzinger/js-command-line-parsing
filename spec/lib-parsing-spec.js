var parser = require('../src/lib-parsing.js');


describe("Parsing of a parameters file", function() {

    beforeEach(function() {
	parser.defineGlobalParameters("src/parameters.json");
    });


    it("Checking that the definition of parameters is loaded.", function() {
	expect(parser.libraryAvailableParameters).toBeDefined();
    });
    
    
    it("Checking that the content of the parameters definition is ok.", function() {
	expect(parser.libraryAvailableParameters['filepath']).toBeDefined();
	expect(parser.libraryAvailableParameters['tokenName']).toBeDefined();
	expect(parser.libraryAvailableParameters['tokenValue']).toBeDefined();
	expect(parser.libraryAvailableParameters['flagReplaceFirstOnly']).toBeDefined();
    });

    
    it("Checking that the content of the filepath definition is ok.", function() {
	expect(parser.libraryAvailableParameters['filepath'].doc).toBeDefined();
	expect(parser.libraryAvailableParameters['filepath'].longOption).toBeDefined();
	expect(parser.libraryAvailableParameters['filepath'].longOption).toEqual('--path-to-file');
	
    });

    
    it("Checking that the content of the tokenName definition is ok.", function() {
	expect(parser.libraryAvailableParameters['tokenName'].doc).toBeDefined();
	expect(parser.libraryAvailableParameters['tokenName'].longOption).toBeDefined();
	expect(parser.libraryAvailableParameters['tokenName'].longOption).toEqual('--token');
	
    });

    
    it("Checking that the content of the tokenValue definition is ok.", function() {
	expect(parser.libraryAvailableParameters['tokenValue'].doc).toBeDefined();
	expect(parser.libraryAvailableParameters['tokenValue'].longOption).toBeDefined();
	expect(parser.libraryAvailableParameters['tokenValue'].longOption).toEqual('--value');
	
    });

    
    it("Checking that the content of the flagReplaceFirstOnly definition is ok.", function() {
	expect(parser.libraryAvailableParameters['flagReplaceFirstOnly'].doc).toBeDefined();
	expect(parser.libraryAvailableParameters['flagReplaceFirstOnly'].longOption).toBeDefined();
	expect(parser.libraryAvailableParameters['flagReplaceFirstOnly'].value).toBeDefined();
	expect(parser.libraryAvailableParameters['flagReplaceFirstOnly'].value).toBe(false);
	
    });

});


describe('Checking that parsing is assigning the good values', function() {
    var parameters;
 
    beforeEach(function() {
	parameters = parser.parse(['--path-to-file', '/tmp/tokenized-file', 'isolatedValue', '--token', 'name', '--value', 'replacement', '--replace-first-only', 'anotherIsolatedValue']);
    });

    it("Passing a valid command line", function() {
	expect(parameters).toBeDefined();
	expect(parameters['filepath']).toBe('/tmp/tokenized-file');
	expect(parameters['tokenName']).toBe('name');
	expect(parameters['tokenValue']).toBe('replacement');
	expect(parameters['flagReplaceFirstOnly']).toBe(true);
	expect(parameters['_unassigned']).toBeDefined();
	expect(parameters['_unassigned'].length).toBe(2);
	expect(parameters['_unassigned'][0]).toBe('isolatedValue');
	expect(parameters['_unassigned'][1]).toBe('anotherIsolatedValue');
    });
});


// =========================================================
describe('Parameters picking', function() {
    var parameters;
 
    beforeEach(function() {
	parser.defineGlobalParameters("src/parameters.json");
	var supported = [ 'filepath', 'tokenName', 'tokenValue' ];
	parameters = parser.pickParameters(supported);
    });
    
    it('Picking parameters', function() {
	expect(parameters.supported).toBeDefined();
	expect(parameters.supported['filepath']).toBeDefined();
	expect(parameters.supported['tokenName']).toBeDefined();
	expect(parameters.supported['tokenValue']).toBeDefined();
	expect(parameters.supported['flagReplaceFirstOnly']).toBeUndefined();
    });

    it('Parsing with restricted set of parameters', function() {
	parameters = parser.parse(['--path-to-file', '/tmp/tokenized-file', 'isolatedValue', '--token', 'name', '--value', 'replacement', '--replace-first-only', 'anotherIsolatedValue'], parameters);
	expect(parameters['filepath']).toBe('/tmp/tokenized-file');
	expect(parameters['tokenName']).toBe('name');
	expect(parameters['tokenValue']).toBe('replacement');
	expect(parameters['flagReplaceFirstOnly']).toBeUndefined();
	expect(parameters['_unassigned']).toBeDefined();
	expect(parameters['_unassigned'].length).toBe(3);
	expect(parameters['_unassigned'][0]).toBe('isolatedValue');
	expect(parameters['_unassigned'][1]).toBe('--replace-first-only');
	expect(parameters['_unassigned'][2]).toBe('anotherIsolatedValue');
	
    });
    
});


// ========================= ERROR  CASES ===================
describe('Error cases must be well handled', function() {
});

var parser = require('../src/lib-parsing.js');


describe("Parsing of a parameters file", function() {

    it("Checking that the definition of parameters is loaded.", function() {
	parser.defineParameters("src/parameters.json");
	expect(parser.libraryAvailableParameters).toBeDefined();
    });
    
    
    it("Checking that the content of the parameters definition is ok.", function() {
	parser.defineParameters("src/parameters.json");
	expect(parser.libraryAvailableParameters['filepath']).toBeDefined();
	expect(parser.libraryAvailableParameters['tokenName']).toBeDefined();
	expect(parser.libraryAvailableParameters['tokenValue']).toBeDefined();
	expect(parser.libraryAvailableParameters['flagReplaceFirstOnly']).toBeDefined();
    });

    it("Checking that the content of the filepath definition is ok.", function() {
	parser.defineParameters("src/parameters.json");
	expect(parser.libraryAvailableParameters['filepath'].doc).toBeDefined();
	expect(parser.libraryAvailableParameters['filepath'].longOption).toBeDefined();
	expect(parser.libraryAvailableParameters['filepath'].longOption).toEqual('--path-to-file');
	
    });

    it("Checking that the content of the tokenName definition is ok.", function() {
	parser.defineParameters("src/parameters.json");
	expect(parser.libraryAvailableParameters['tokenName'].doc).toBeDefined();
	expect(parser.libraryAvailableParameters['tokenName'].longOption).toBeDefined();
	expect(parser.libraryAvailableParameters['tokenName'].longOption).toEqual('--token');
	
    });

    it("Checking that the content of the tokenValue definition is ok.", function() {
	parser.defineParameters("src/parameters.json");
	expect(parser.libraryAvailableParameters['tokenValue'].doc).toBeDefined();
	expect(parser.libraryAvailableParameters['tokenValue'].longOption).toBeDefined();
	expect(parser.libraryAvailableParameters['tokenValue'].longOption).toEqual('--value');
	
    });

    it("Checking that the content of the flagReplaceFirstOnly definition is ok.", function() {
	parser.defineParameters("src/parameters.json");
	expect(parser.libraryAvailableParameters['flagReplaceFirstOnly'].doc).toBeDefined();
	expect(parser.libraryAvailableParameters['flagReplaceFirstOnly'].longOption).toBeDefined();
	expect(parser.libraryAvailableParameters['flagReplaceFirstOnly'].value).toBeDefined();
	expect(parser.libraryAvailableParameters['flagReplaceFirstOnly'].value).toBe(false);
	
    });

});


describe('Checking that parsing is defining the good values', function() {
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


// ========================= ERROR  CASES ===================
describe('Error cases must be well handled', function() {
});

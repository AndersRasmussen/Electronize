// files necessary for unit testing
require("../common");
var Assert = require('assert');
// the modules that should be tested
var NeedsTesting = require('../NeedsTesting');

// name of the module that is to be tested
describe("PoC test", function(){
	var _moduleThatNeedsTesting = new NeedsTesting();

	before(function(){
		// run before all tests in this module
	});
	after(function(){
		// run previous to all tests in this module
	});
	beforeEach(function(){
		// run before each "it"-function
	});
	afterEach(function(){
		// run previous to each "it"-function
	});

	// 1 to many "it"-functions
	it("should be possible to run a unit test", function(done){
		Assert.equal(_moduleThatNeedsTesting.returnFalse(), false);
		Assert.equal(_moduleThatNeedsTesting.returnTrue(), true);
		// test logging utility
		logDebug("We should not log messages during a {0} :/".format("unit test"))
		done(); // this can be used for asynchronous methods, or just left out as argument
	});

	it("should be possible to run one more unit test", function(){
		Assert.equal("1", 1); // I love you, js!
	});	
});
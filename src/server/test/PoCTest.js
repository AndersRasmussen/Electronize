require("../common")
var Assert = require('assert')
var NeedsTesting = require('../NeedsTesting')

describe("PoC test", function(){
	before(function(){});
	after(function(){});
	beforeEach(function(){});
	afterEach(function(){});

	it("should be possible to run at unit test", function(done){
		var moduleThatNeedsTesting = new NeedsTesting();
		Assert.equal(moduleThatNeedsTesting.returnFalse(), false);
		Assert.equal(moduleThatNeedsTesting.returnTrue(), true);
		// test logging utility
		logDebug("We should not log messages during a {0} :/".format("unit test"))
		done(); // this can be used for asynchronous methods, or just left out as argument
	});
});
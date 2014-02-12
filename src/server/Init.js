require('./common'); // initialize the standard scope with utils

process.addListener('uncaughtException', function(err, stack) {
	console.log('---------------------');
	console.log('Exception: ' + err);
	console.log(err.stack);
	return console.log('---------------------');
});

var ApplicationServer = require('./BoilerPlate');
new ApplicationServer();
logDebug("ApplicationServer has started!")

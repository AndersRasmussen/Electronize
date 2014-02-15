var HttpServer = require('./HttpServer');
var WebsocketServer = require('./WebsocketServer');

var ApplicationServer = function(){
	var self = this;
	var httpServer = new HttpServer();
	var websocketServer = new WebsocketServer(httpServer);
};

module.exports = ApplicationServer;
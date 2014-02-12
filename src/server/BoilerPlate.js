var HttpServer = require('./HttpServer')
var WebsocketServer = require('./WebsocketServer')

Application = function(){
	var self = this;
	var httpServer = new HttpServer();
	var websocketServer = new WebsocketServer(httpServer);
}

module.exports = Application;
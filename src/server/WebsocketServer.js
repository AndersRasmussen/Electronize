var socketIO = require('socket.io')
var config = require('../config')

var WebsocketServer = function(httpServer){
	var self = this;
	self.webSocket = null;

	var init = function(){
		logInfo('Setting up websockets...');
		self.webSocket = socketIO.listen(httpServer);
		self.webSocket.set('log level', 1);
		// create webSocketHandlers
		self.webSocketEvent = self.webSocket
		.of('/event')
		.on('connection', function(clientSocket){
			logDebug('WS connection established');
			//@webSocket.sockets.send('New WebSocket Connection (to all)')
			//@webSocketEvent.send('New WebSocket Connection (to event subscribers)')
			//clientSocket.send('Hi new client!')

			clientSocket.on('EVENT', function(event){
				//self.remoteEventReceived(event.name, event.data, clientSocket)
				// send back data
				clientSocket.emit('EVENT', event);
			});

			clientSocket.on('disconnect', function(){
				logDebug('WS connection ended');
			});
		});
		return self;
	}

	return init();
}

module.exports = WebsocketServer;
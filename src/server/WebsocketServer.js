var socketIO = require('socket.io')
var config = require('./config')

var WebsocketServer = function(httpServer){
	var self = this;
	self.webSocket = null;
	
	self.board = {
		height: 100,
		width: 140,
		players: {}
	};
	
	// contains all the connected client sockets
	var clientSockets = {}

	var init = function(){
		logInfo('Setting up websockets...');
		self.webSocket = socketIO.listen(httpServer);
		self.webSocket.set('log level', 1);
		// create webSocketHandlers
		self.webSocketEvent = self.webSocket
		.of('/event')
		.on('connection', function(clientSocket){
			clientSockets[clientSocket.id] = clientSocket;
			logDebug('WS connection established');
			//@webSocket.sockets.send('New WebSocket Connection (to all)')
			//@webSocketEvent.send('New WebSocket Connection (to event subscribers)')
			//clientSocket.send('Hi new client!')
			
			clientSocket.on("JOIN", function() {
				var player = {
					id: clientSocket.id,
					x: Math.floor(Math.random() * self.board.width) + 1,
					y: Math.floor(Math.random() * self.board.height) + 1,
					points: 0,
					r: 0,
					v: 0
				}
				
				addPlayer(player);
				
				logDebug("Player " + player.id + " joined");
			});
			
			clientSocket.on("LEAVE", function() {
				if (hasJoined(clientSocket.id)) {
					removePlayer(clientSocket.id);
				}
			});

			// Depricated
			clientSocket.on('EVENT', function(event){
				//self.remoteEventReceived(event.name, event.data, clientSocket)
				// send back data
				clientSocket.emit('EVENT', event);
			});
			
			clientSocket.on('MOVE', function() {
				logDebug("Move move move!!!");
			});

			clientSocket.on('disconnect', function(){
				if (hasJoined(clientSocket.id)) {
					removePlayer(clientSocket.id);
				}
				delete clientSockets[clientSocket.id];
				logDebug('WS connection ended');
			});

			broadcastBoardUpdate();
		});
		return self;
	}
	
	var addPlayer = function(player) {
		self.board.players[player.id] = player;
		self.broadcastBoardUpdate();
	};
	
	var removePlayer = function(playerId) {
		delete self.board.players[playerId];
		self.broadcastBoardUpdate();
		logDebug("Removed player " + playerId);
	}
	
	var hasJoined = function(playerId) {
		return self.board.players[playerId] != null;
	}
	
	var broadcastBoardUpdate = function() {
		for (var socketId in clientSockets) {
			clientSockets[socketId].emit("BOARDUPDATE", self.board);
		}
		logDebug("game update broadcasted");
	};

	return init();
}

module.exports = WebsocketServer;
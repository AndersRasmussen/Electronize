var socketIO = require('socket.io')
var config = require('./config')
var NameFactory = require('./NameFactory.js')

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


	var gameloop = function() {
		
		for (var playerId in self.board.players) {
			var player = self.board.players[playerId];
			
			player.rotation = player.rotation + (Math.random() * Math.PI/4);
			player.speed = 2;
			
			var oldX = player.x;
			var oldY = player.y;
			var deltaX = Math.cos(player.rotation)*player.speed;
			var deltaY = Math.sin(player.rotation)*player.speed;
			player.x = player.x + deltaX;
			player.y = player.y + deltaY;
			
			player.x = player.x.clamp(0, self.board.width);
			player.y = player.y.clamp(0, self.board.height);

			logDebug("Moved " + player.nickname + " from (" + oldX + "," + oldY + ") to (" + player.x + "," + player.y + ")");
			
		}
		broadcastBoardUpdate();
	}

	var init = function(){
		var namefactory = new NameFactory();

		setInterval(gameloop, 500);
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
					nickname: namefactory.generate(),
					x: Math.floor(Math.random() * self.board.width) + 1,
					y: Math.floor(Math.random() * self.board.height) + 1,
					points: 0,
					rotation: Math.random() * 2*Math.PI,
					speed: 0
				}
				
				addPlayer(player);
				
				clientSocket.emit('JOINED', { playerid: player.id, nickname: player.nickname });
				
				logDebug("Player " + player.nickname + " (" + player.id + ") joined");
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
			
			clientSocket.on('MOVE', function(velocity) {
				
				
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
	}
	
	var addPlayer = function(player) {
		self.board.players[player.id] = player;
		broadcastBoardUpdate();
	};
	
	var removePlayer = function(playerId) {
		delete self.board.players[playerId];
		broadcastBoardUpdate();
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
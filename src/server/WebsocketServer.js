var socketIO = require('socket.io')
var config = require('./config')
var NameFactory = require('./NameFactory.js')

var WebsocketServer = function(httpServer){
	var self = this;
	self.webSocket = null;
	
	self.board = {
		height: config.boardHeight,
		width: config.boardWidth,
		players: {}
	};
	
	// contains all the connected client sockets
	var clientSockets = {}

	var gameloop = function(delta) {
		var deltaSpeed = delta/1000;
		for (var playerId in self.board.players) {
			var player = self.board.players[playerId];
						
			var oldX = player.x;
			var oldY = player.y;
			var deltaX = Math.cos(player.rotation)*(player.speed * deltaSpeed * config.maxSpeed);
			var deltaY = Math.sin(player.rotation)*(player.speed * deltaSpeed * config.maxSpeed);
			
			player.x = player.x + deltaX;
			player.y = player.y + deltaY;
			
			player.x = player.x.clamp(config.playerWidth/2, self.board.width - config.playerWidth/2);
			player.y = player.y.clamp(config.playerWidth/2, self.board.height - config.playerHeight/2);

			if (!player.hasMoved) {
				player.rotation = (player.rotation + (Math.random() * Math.PI/2) - Math.PI/4);
 				player.speed = (player.speed + Math.random()*0.2 - 0.1).clamp(0,1);
			}
		}
	};
	
	var gameloopid = null;
	var startGameloop = function() {
		var last = Date.now();
		gameloopid = setInterval(function() {
				var now = Date.now();
				var delta = now - last;
				last = now;
				gameloop(delta);
			}, config.gameloopInterval);
	}
	
	var stopGameloop = function() {
		if (gameloopid != null) {
			clearInterval(gameloopid);
			gameloopid = null;
		}
	}

	var init = function(){
		startGameloop();
		setInterval(broadcastBoardUpdate, config.boardUpdateInterval);
		
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
				
//				for(var  i = 0; i < 50; i++)
//				{
//					var player = makePlayer(clientSocket.id+""+i);
//					addPlayer(player);
//				}

				if (isBoardFull()) {
					clientSocket.emit("BOARDFULL");
				} else {
					var player = makePlayer(clientSocket.id);
					addPlayer(player);
					clientSocket.emit('JOINED', { playerid: player.id, nickname: player.nickname });
					logDebug("Player " + player.nickname + " (" + player.id + ") joined");
				}
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
				var player = self.board.players[clientSocket.id];

				// If the player is killed or are having sex, they can't move
				if (player.killed || player.mate) {
					return;
				}
				
				player.rotation = velocity.rotation;
				player.speed = velocity.speed.clamp(0, 1); // received velocity should be between 0 and 1
				player.hasMoved = true;
				logDebug("Move move move!!!");
			});
			
			clientSocket.on('LOVE', function(otherPlayerId) {
//				var otherPlayer = getPlayer(otherPlayerId);
				
				
//				console.log("Making love with " + otherPlayer.nickname);
			});
			
			clientSocket.on('KILL', function() {
				var currentPlayer = getPlayer(clientSocket.id);
				
				for (var playerid in self.board.players) {
					var otherPlayer = getPlayer(playerid);
					
					if (currentPlayer === otherPlayer)
						return;	
					
					if (otherPlayer.killed || otherPlayer.mate)
						return;

					var deltaX = otherPlayer.x - currentPlayer.x;
					var deltaY = otherPlayer.y - currentPlayer.y;

					var direction = Math.atan2(deltaY, deltaX)
					var distance = Math.sqrt(Math.pow(deltaX,2) + Math.pow(deltaY,2));

					var minDirection = currentPlayer.rotation - config.playerSightWidth/2;
					var maxDirection = currentPlayer.rotation + config.playerSightWidth/2;

					console.log("Diretion", direction, "Min/Max", minDirection, maxDirection);
					console.log("Distance", distance, "Sight", config.playerSightLength);

					if (minDirection <= direction && direction <= maxDirection && distance <= config.playerSightLength) {
						otherPlayer.killed = true;
						otherPlayer.speed = 0;
						setTimeout(function() {
							otherPlayer.killed = false;
							otherPlayer.points = 0;
							otherPlayer.x = Math.floor(Math.random() * self.board.width) + 1;
							otherPlayer.y = Math.floor(Math.random() * self.board.height) + 1;
						}, 10000);
						console.log("Kill " + otherPlayer.nickname);
					}
				}
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
	
	var namefactory = new NameFactory();
	
	var makePlayer = function(playerid) {
		return {
			id: playerid,
			nickname: namefactory.generate(),
			x: Math.floor(Math.random() * self.board.width) + 1,
			y: Math.floor(Math.random() * self.board.height) + 1,
			points: 0,
			rotation: Math.PI/2,
			speed: 0,
			killed: false,
			mate: false,
			tased: false,
			tasing: null,
			hasMoved: false
		};
	}
	
	var getPlayer = function(playerid) {
		return self.board.players[playerid];
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
	
	var isBoardFull = function() {
		return Object.keys(self.board.players).length >= config.maxPlayer;
	}
	
	var broadcastBoardUpdate = function() {
		for (var socketId in clientSockets) {
			clientSockets[socketId].emit("BOARDUPDATE", self.board);
		}
	};

	return init();
}

module.exports = WebsocketServer;
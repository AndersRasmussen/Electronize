function MiniCanvasController($rootScope, $scope){
	var expectedUpdateRate = 500;
	logDebug("CanvasController initializing");
	var _playerGfx = {};
	var _paper;
	var _circle;

	var setMapSize = function(w, h){
		logInfo("initializing canvas");
		if( !_paper) {
			_paper = new Raphael("gameCanvas");
		}
		_paper.setViewBox(0, 0, w, h, true);

		var rect = _paper.rect(0, 0, w, h, 40);
		rect.attr({"fill": "url('/img/grass.png')", "stroke": "#000", "stroke-width": "1px"});			

		// debug
		_circle = _paper.circle(0, 0, 10);
		_circle.attr("fill", "#f00");
		_circle.attr("stroke", "#fff");
	}

	// update playerGfx
	var updatePlayerPos = function(playerGfx, playerDto){
		var width = playerGfx.gfx.attr("width");
		var height = playerGfx.gfx.attr("height");
		var x = playerGfx.gfx.attr("x");
		var y = playerGfx.gfx.attr("y");
		var midPointX = width / 2;
		var midPointY = height / 2;

		x2 = playerDto.x - width / 2; // offset to midpoint for picture
		y2 = playerDto.y - height / 2; // offset to midpoint for picture
		
		var rot = playerGfx.gfx.attr("transform");
		console.log(rot);
		var rot2 = 360.0*(playerDto.rotation / (2*Math.PI))-90;
		
		var dx = x2 - x;
		var dy = y2 - y;
		var drot = rot2 - rot;

		playerGfx.gfx.stop();
		playerGfx.gfx.animate({'transform': "T{0},{1}r{2},{3},{4}".format(dx,dy,rot2,midPointX,midPointY)}, expectedUpdateRate, "linear");

		// debug
		_circle.attr({'cx': playerDto.x, 'cy': playerDto.y});
		_circle.toFront();


		playerGfx.player = playerGfx.newPlayer;
		playerGfx.newPlayer = playerDto;
		playerGfx.updated = true;
	};

	// create playerGfx
	var createNewPlayer = function(playerDto){
		var gfx = gfxRessources.createPlayerGfx(_paper);

		var width = gfx.attr("width");
		var height = gfx.attr("height");
		console.log("Width: {0}".format(width));
		var midPointX = width / 2;
		var midPointY = height / 2;
		var rot2 = 360.0*(playerDto.rotation / (2*Math.PI))-90;
		gfx.attr({'transform': "T{0},{1}r{2},{3},{4}".format(playerDto.x,playerDto.y,rot2,midPointX,midPointY)});
		return { // playerGfx class
			'newPlayer': playerDto,
			'gfx': gfx,
			'update': false
		}
	};

	var autoRender = function(){
		var timer = setInterval(renderPaper,50);
	};

	var renderPaper = function(boardState){
		// patches the scene with new objects
		logDebug(".");
	};

	$scope.$on("BOARDUPDATE", function(event, boardState){
		
		logDebug("Board state received.");
		console.log(boardState);

		// mark players as not updated
		for( var playerid in _playerGfx){
			_playerGfx[playerid].updated = false;
		}

		// update movements and create players
		for( var playerid in boardState.players){
			var playerDto = boardState.players[playerid];
			var playerGfx = _playerGfx[playerDto.id];
			if( playerGfx == null)
			{
				// create new playerGfx
				logInfo("Creating new player gfx: '{0}'".format(playerDto.id));
				playerGfx = createNewPlayer(playerDto);
				_playerGfx[playerDto.id] = playerGfx;
			}
			updatePlayerPos(playerGfx, playerDto);
		}

		// remove unused players
		for( var playerid in _playerGfx){
			var playerGfx = _playerGfx[playerid];
			if( playerGfx.updated == false)
			{
				// remove player from board
				playerGfx.gfx.remove();
				// remove player from local list
				delete _playerGfx[playerid];
			}
		}

	});

	setMapSize(1400,1000);

	logDebug("CanvasController finished initializing");
}
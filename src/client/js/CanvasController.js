function CanvasController($rootScope, $scope){
	logDebug("CanvasController initializing");
	var _playerGfx = {};
	var _paper;

	var setMapSize = function(w, h){
		logInfo("initializing canvas")
		if( !_paper)
			_paper = Raphael("gameCanvas");
		_paper.setViewBox(0, 0, w, h, true);

		var rect = _paper.rect(0, 0, w, h, 40);
		rect.attr({"fill": "#09F", "stroke": "#000", "stroke-width": "1px"});

		//var circle = _paper.circle(200, 200, 10);
		// Sets the fill attribute of the circle to red (#f00)
		//circle.attr("fill", "#f00");
		// Sets the stroke attribute of the circle to white
		//circle.attr("stroke", "#fff");
	}

	// update playerGfx
	var updatePlayerPos = function(playerGfx, playerDto){
		var width = playerGfx.gfx.attr("width");
		var height = playerGfx.gfx.attr("height");
		var x = playerDto.x - width / 2;
		var y = playerDto.y - height / 2;
		playerGfx.gfx.attr({'x': x, 'y': y})

		playerGfx.player = playerGfx.newPlayer;
		playerGfx.newPlayer = playerDto;

		playerGfx.updated = true;
	}

	// create playerGfx
	var createNewPlayer = function(playerDto){
		var gfx = gfxRessources.createPlayerGfx(_paper);
		return { // playerGfx class
			'newPlayer': playerDto,
			'gfx': gfx,
			'update': false
		}
	}

	var autoRender = function(){
		var timer = setInterval(renderPaper,50);
	}

	var renderPaper = function(boardState){
		// patches the scene with new objects
		logDebug(".");
	}

	$scope.$on("BOARDUPDATE", function(event, boardState){
		
		logDebug("Board state received.");

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
				_playerGfx[playerid] = undefined;
			}
		}

	});

	setMapSize(1400,1000);

	logDebug("CanvasController finished initializing");
}
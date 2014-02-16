function CanvasController($rootScope, $scope, $$soundManager){
	var mapWidth = 1400;
	var mapHeight = 1000;
	var expectedUpdateRate = 200;
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

		var rect = _paper.rect(0, 0, w, h, 0);
		rect.attr({"fill": "url('/img/grass2.png')", "stroke": "#000", "stroke-width": "1px"});			

		//gfxRessources.animateHeart(3, _paper, 100, 100 );
		//gfxRessources.animateHeart(3, _paper, 500, 500 );

		// debug
		//_circle = _paper.circle(0, 0, 10);
		//_circle.attr("fill", "#f00");
		//_circle.attr("stroke", "#fff");
	}

	// update playerGfx
	var updatePlayerPos = function(playerGfx, playerDto){
		var width = playerGfx.gfx.attr("width");
		var height = playerGfx.gfx.attr("height");

		if(playerDto.killed && !playerGfx.lastKilled)
		{
			gfxRessources.animateDeath(4, _paper, playerDto.x, mapHeight-playerDto.y);
			logDebug("Player was killed");
			$$soundManager.killed();
		}

		if(playerDto.loving && !playerGfx.lastLoving)
		{
			gfxRessources.animateHeart(4, _paper, playerDto.x, mapHeight-playerDto.y);
			$$soundManager.loving();
		}

		playerGfx.lastKilled = playerDto.killed;
		playerGfx.lastLoving = playerDto.loving;

		var midPointX = width / 2;
		var midPointY = height / 2;

		var x = playerDto.x;
		var y = mapHeight - playerDto.y;  // flip y-coords
		var x2 = x - midPointX; // offset to midpoint for picture
		var y2 = y - midPointY; // offset to midpoint for picture
		
		var rot2 = -360.0*(playerDto.rotation / (2*Math.PI))-90;

		playerGfx.gfx.stop();
		playerGfx.gfx.animate({'transform': "T{0},{1}r{2},{3},{4}".format(x2,y2,rot2,midPointX,midPointY)}, expectedUpdateRate, "linear");

		// debug
		//_circle.attr({'cx': x2, 'cy': y2});
		//_circle.toFront();


		playerGfx.player = playerGfx.newPlayer;
		playerGfx.newPlayer = playerDto;
		playerGfx.updated = true;
	};

	// create playerGfx
	var createNewPlayer = function(playerDto){
		var gfx = gfxRessources.createPlayerGfx(_paper, playerDto.spriteType);
		var x = playerDto.x;
		var y = mapHeight - playerDto.y;  // flip y-coords

		var width = gfx.attr("width");
		var height = gfx.attr("height");

		var midPointX = width / 2;
		var midPointY = height / 2;
		var x2 = x - midPointX; // offset to midpoint for picture
		var y2 = y - midPointY; // offset to midpoint for picture

		var rot2 = -360.0 * (playerDto.rotation / (2*Math.PI))-90;
		gfx.attr({'transform': "T{0},{1}r{2},{3},{4}".format(x2,y2,rot2,midPointX,midPointY)});
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

	setMapSize(mapWidth,mapHeight);

	logDebug("CanvasController finished initializing");
}
// requestAnimationFrame polyfill by Erik Möller. fixes from Paul Irish and Tino Zijdel
 (function() {
    var lastTime = 0;
    var vendors = ['ms', 'moz', 'webkit', 'o'];
    for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
        window.cancelAnimationFrame = window[vendors[x]+'CancelAnimationFrame'] 
                                   || window[vendors[x]+'CancelRequestAnimationFrame'];
    }
 
    if (!window.requestAnimationFrame)
        window.requestAnimationFrame = function(callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function() { callback(currTime + timeToCall); }, 
              timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };
 
    if (!window.cancelAnimationFrame)
        window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };
}());

function MiniCanvasController($rootScope, $scope, $$soundManager){
	var mapWidth = 1400;
	var mapHeight = 1000;
	var minimapWidth = 600;
	var minimapHeight = 474;
	var circleOfDeathRadius = 200; // PI / 2

	var expectedUpdateRate = 200; // ms
	var animationInterval = 1000; // ms
	logDebug("CanvasController initializing");
	var _playerGfx = {};
	var _paper;
	var _circle;
	var _devicePlayerGfx;
	var _flashLight = null;

	var pizzaSlice = function (cx, cy, r, startAngle, endAngle, params) {
		var rad = Math.PI / 180;
		var x1 = cx + r * Math.cos(-startAngle * rad),
		x2 = cx + r * Math.cos(-endAngle * rad),
		y1 = cy + r * Math.sin(-startAngle * rad),
		y2 = cy + r * Math.sin(-endAngle * rad);
		return _paper.path(["M", cx, cy, "L", x1, y1, "A", r, r, 0, +(endAngle - startAngle > 180), 0, x2, y2, "z"]).attr(params);
	}

	var setMapSize = function(w, h){
		logInfo("initializing canvas");
		if( !_paper ){
			_paper = new Raphael("miniCanvas");
		}
		_paper.setViewBox(0, 0, w, h, true);
		var rect = _paper.rect(0, 0, w, h, 40);
		rect.attr({"fill": "url('/img/grass2.png')", "stroke": "#000", "stroke-width": "1px"});

		// debug
		//_circle = _paper.circle(0, 0, 10);
		//_circle.attr("fill", "#f00");
		//_circle.attr("stroke", "#fff");
	}

	// update playerGfx
	var updatePlayerPos = function(playerGfx, playerDto, isDevicePlayer){
		if( isDevicePlayer )
		{
			_devicePlayerGfx = playerGfx; // mark gfx of device player
		}

		var width = playerGfx.gfx.attr("width");
		var height = playerGfx.gfx.attr("height");
		//var x = playerGfx.gfx.attr("x");
		//var y = playerGfx.gfx.attr("y");
		if(playerDto.killed && !playerGfx.lastKilled)
		{
			gfxRessources.animateDeath(4, _paper, playerDto.x, mapHeight-playerDto.y);
			$$soundManager.killed();
			logDebug("Player was killed");
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

		var rot2 = -360.0*(playerDto.rotation / (2*Math.PI));

		//var rot = playerGfx.gfx.attr("transform");
		//console.log(rot);
		//var dx = x2 - x;
		//var dy = y2 - y;
		//var drot = rot2 - rot;

		playerGfx.gfx.stop();
		playerGfx.gfx.animate({'transform': "T{0},{1}r{2},{3},{4}".format(x2,y2,rot2-90,midPointX,midPointY)}, expectedUpdateRate, "linear");

		if( playerDto.lovable )
		{
			var hWidth = playerGfx.heart.attr("width");
			var hHeight = playerGfx.heart.attr("height");
			var xH2 = x - hWidth / 2; // offset to midpoint for picture
			var yH2 = y - hHeight / 2; // offset to midpoint for picture

			playerGfx.heart.stop();
			playerGfx.heart.animate({'transform': "T{0},{1}".format(xH2,yH2)}, expectedUpdateRate, "linear");
			playerGfx.heart.show();
		}
		else
			playerGfx.heart.hide();

		if( isDevicePlayer && _flashLight != null )
		{
			_flashLight.stop();
			_flashLight.animate({'transform': "T{0},{1}r{2},0,0".format(x, y, rot2)}, expectedUpdateRate, "linear");
			_flashLight.toFront();
		}
		else if( isDevicePlayer && _flashLight == null){
			_flashLight = pizzaSlice(0,0,100,-45,45,{
				"fill": "#0A0",
				"fill-opacity": "0.2", 
				"stroke": "#000", 
				"stroke-dasharray": "--..", 
				"stroke-width": "0.5px",
				"stroke-opacity": "0.7"
			});
			_flashLight.attr({'transform': "T{0},{1}r{2},0,0".format(x, y, rot2)});
			_flashLight.toFront();
		}

		// debug
		//_circle.attr({'cx': x2, 'cy': y2});
		//_circle.toFront();
		playerGfx.gfx.toFront();
		playerGfx.heart.toFront();
		playerGfx.player = playerGfx.newPlayer;
		playerGfx.newPlayer = playerDto;
		playerGfx.updated = true;
	};

	// create playerGfx
	var createNewPlayer = function(playerDto){
		var heart = gfxRessources.createLovableHeart(_paper);
		var gfx = gfxRessources.createPlayerGfx(_paper, playerDto.spriteType);
		var x = playerDto.x;
		var y = mapHeight - playerDto.y;  // flip y-coords

		var width = gfx.attr("width");
		var height = gfx.attr("height");

		var midPointX = width / 2;
		var midPointY = height / 2;
		var x2 = x - midPointX; // offset to midpoint for picture
		var y2 = y - midPointY; // offset to midpoint for picture

		var rot2 = -360.0*(playerDto.rotation / (2*Math.PI));
		gfx.attr({'transform': "T{0},{1}r{2},{3},{4}".format(x2,y2,rot2-90,midPointX,midPointY)});

		if( playerDto.lovable )
		{
			var hWidth = heart.attr("width");
			var hHeight = heart.attr("height");
			var xH2 = x - hWidth / 2; // offset to midpoint for picture
			var yH2 = y - hHeight / 2; // offset to midpoint for picture

			heart.animate({'transform': "T{0},{1}".format(xH2,yH2)}, expectedUpdateRate, "linear");
			heart.show();
		}
		else
			heart.hide();

		return { // playerGfx class
			'newPlayer': playerDto,
			'gfx': gfx,
			'heart': heart,
			'update': false
		}
	};

	// follow the device player with the minimap camera
	var enableAutoMoveMap = function(){
		requestAnimationFrame(function(){
			if( _devicePlayerGfx != null )
			{
				var x = _devicePlayerGfx.gfx.matrix.x(0,0);
				var y = _devicePlayerGfx.gfx.matrix.y(0,0);
				//logDebug("I was detected ({0},{1})!".format(playerDto.x,playerDto.x.y));

				_paper.setViewBox(x - minimapWidth/2, y - minimapHeight/2, minimapWidth, minimapHeight);

			}
			enableAutoMoveMap();
		});
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

		// get position of devicePlayer
		var x,y;
		for( var playerid in boardState.players){
			if(playerid == $scope.playerid){
				x = boardState.players[playerid].x;
				y = boardState.players[playerid].y;
			}
		}

		var dist = function(x1,y1,x2,y2){
			return Math.sqrt(Math.pow(x2-x1,2)+Math.pow(y2-y1,2));
		}

		var activePlayers = 0;
		// update movements and create players
		for( var playerid in boardState.players){
			var playerDto = boardState.players[playerid];

			// check if player is to far away
			if( dist(x,y,playerDto.x,playerDto.y) > Math.max(minimapWidth, minimapHeight) )
				continue; // ignore player

			activePlayers++;
			var playerGfx = _playerGfx[playerDto.id];
			if( playerGfx == null)
			{
				// create new playerGfx
				logInfo("Creating new player gfx: '{0}'".format(playerDto.id));
				playerGfx = createNewPlayer(playerDto);
				_playerGfx[playerDto.id] = playerGfx;
			}
			updatePlayerPos(playerGfx, playerDto, playerid == $scope.playerid);

		}
		

		// remove unused players
		for( var playerid in _playerGfx){
			var playerGfx = _playerGfx[playerid];
			if( playerGfx.updated == false)
			{
				// remove player from board
				playerGfx.gfx.remove();
				playerGfx.heart.remove();
				// remove player from local list
				delete _playerGfx[playerid];
			}
		}

	});

	enableAutoMoveMap();
	setMapSize(mapWidth,mapHeight);

	logDebug("CanvasController finished initializing");
}
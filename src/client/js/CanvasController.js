function CanvasController($rootScope, $scope){
	logDebug("CanvasController initializing");
	var _playerGfx = [];
	var _paper;

	var setMapSize = function(w, h){
		logInfo("initializing canvas")
		if( !_paper)
			_paper = Raphael("gameCanvas");
		_paper.setViewBox(0, 0, w, h, true);

		var rect = _paper.rect(0, 0, 1400, 1000, 40);
		rect.attr({"fill": "#09F", "stroke": "#000", "stroke-width": "1px"});


		var player = gfxRessources.createPlayerGfx(_paper);
		var playerGfx = {
			'gfx': {
				'gfx': player,
			}
		};
		setPlayerPos(playerGfx, 200, 200);


		var circle = _paper.circle(200, 200, 10);
		// Sets the fill attribute of the circle to red (#f00)
		circle.attr("fill", "#f00");
		// Sets the stroke attribute of the circle to white
		circle.attr("stroke", "#fff");
	}

	var setPlayerPos = function(playerGfx, x, y){
		var width = playerGfx.gfx.gfx.attr("width");
		var height = playerGfx.gfx.gfx.attr("height");
		x = x - width / 2;//(2*playerGfx.gfx.scale);
		y = y - height / 2;//(2*playerGfx.gfx.scale);
		playerGfx.gfx.gfx.attr({'x': x, 'y': y})
	}

	var createNewPlayer = function(){

	}

	var autoRender = function(){
		var timer = setInterval(renderPaper,50);
	}

	var _cubeRotateX=0,_cubeRotateY=0;
	var renderPaper = function(boardState){
		// patches the scene with new objects
		logDebug(".");
	}

	$scope.$on("BOARDUPDATE", function(event, boardState){
		// check for map size change and render map

	});

	setMapSize(1400,1000);

	logDebug("CanvasController finished initializing");
}
function CanvasController($rootScope, $scope){
	logDebug("CanvasController initializing");
	var _paper;

	var setMapSize = function(w, h){
		logInfo("initializing canvas")
		if( !_paper)
			_paper = Raphael("gameCanvas");
		_paper.setViewBox(0, 0, w, h, true);

		var rect = _paper.rect(0, 0, 1400, 1000, 40);
		rect.attr({"fill": "#09F", "stroke": "#000", "stroke-width": "1px"});


		var circle = _paper.circle(500, 500, 50);
		// Sets the fill attribute of the circle to red (#f00)
		circle.attr("fill", "#f00");
		// Sets the stroke attribute of the circle to white
		circle.attr("stroke", "#fff");

		var player = gfxRessources.createPlayerGfx(_paper);
		player.scale(0.5,0.5);
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
		// build scene
		// requestAnimationFrame(render); // build scene

	}

	$scope.$on("BOARDUPDATE", function(event, boardState){
		// check for map size change and render map

	});

	setMapSize(1400,1000);

	logDebug("CanvasController finished initializing");
}
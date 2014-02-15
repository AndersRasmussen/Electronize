function CanvasController($rootScope, $scope){
	logDebug("CanvasController initializing");
	var _paper;
	var setMapSize = function(w, h){
		if( !_paper)
			_paper = Raphael("gameCanvas");
		_paper.setViewBox(0, 0, w, h, true);
		renderPaper();
	}

	var renderPaper = function(){
		var rect = _paper.rect(0, 0, 1400, 1000, 40);
		rect.attr({"fill": "#09F", "stroke": "#000", "stroke-width": "1px"});
	}

	$scope.$on("BOARDUPDATE", function(event, boardState){
		// check for map size change and render map
	});



	setMapSize(1400,1000);

	logDebug("CanvasController finished initializing");
}
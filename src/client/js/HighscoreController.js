function HighscoreController($rootScope, $scope){
	$scope.playerid = "<Player id>";
	$scope.highscores = [];
	
	$scope.$on("JOINED", function(event, player){
		// player has joined
		$scope.playerid = player.playerid;
		$scope.nickname = player.nickname;
	});

	var _boardState;
	$scope.$on("BOARDUPDATE", function(event, boardState){
		_boardState = boardState;
	});

	var enableUpdateHighscore = function(){
		setInterval(function(){
			// sort players by score

			$scope.highscores = [];
		}, 2000);
	}

}
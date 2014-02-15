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
		var findHighestScore = function(players){
			var maxPts = -9999999.0;
			var bestIndex = -1;
			for(var i = 0; i < players.length; i++)
			{
				if( players[i].points > maxPts)
					bestIndex = i;
			}
			return (bestIndex > -1)? bestIndex: null;
		}

		setInterval(function(){
			// sort players by score
			if( _boardState == null )
				return;

			var players = [];
			var highscores = [];
			for(var playerid in _boardState.players)
				players.push(_boardState.players[playerid]);

			for( var i = 0; i < 10; i++)
			{
				var bestIndex = findHighestScore(players);
				if(bestIndex != null && bestIndex > -1){
					var player = players[bestIndex];
					highscores.push({nickname: player.nickname, score: player.points});
					players.splice(bestIndex,1);
				}
				else
					break;
			}

			$scope.highscores = highscores;
		}, 2000);
	}
	enableUpdateHighscore();

}
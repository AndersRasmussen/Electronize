function HighscoreController($rootScope, $scope){
	$scope.playerid = "<Player id>";
	
	$scope.$on("JOINED", function(player){
		// player has joined
		$scope.playerid = player.playerid;
	});
}
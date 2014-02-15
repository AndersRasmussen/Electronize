function ScreenController($rootScope, $scope){
	$scope.$on("APPLICATION_INITIALIZED", function(event){
		// the communication is up, let's send something
		$rootScope.websocketService.send("Hej");
	});

	this.broadcastEvent = function(eventname, args){
		logDebug("Broadcasting controller event: '{0}'".format(eventname));
		$rootScope.$broadcast(eventname, args);
		$rootScope.$digest();
	}

	var screenApplication = new ScreenApplication(this, $rootScope);
}
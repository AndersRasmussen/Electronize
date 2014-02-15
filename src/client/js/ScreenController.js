function ScreenController($rootScope, $scope, $$application, $$websocketService){
	$scope.$on("APPLICATION_INITIALIZED", function(event){
		// the communication is up, let's send something
		$$websocketService.send("Hej");
		$$websocketService.join();
	});

	$rootScope.broadcastEvent = function(eventname, args){
		logDebug("Broadcasting controller event: '{0}'".format(eventname));
		$rootScope.$broadcast(eventname, args);
		$rootScope.$digest();
	}
}
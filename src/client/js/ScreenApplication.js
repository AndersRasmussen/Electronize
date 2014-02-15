function ScreenApplication(mainController, rootScope){
	var _websocketService;
	logInfo("Application initializing");

	_websocketService = new WebsocketService();
	// here we fetch config file from server
	$.getJSON("/config.json", function(config){
		_websocketService.connect("{0}:{1}/event".format(config.wsUrl, config.wsPort));
		_websocketService.setMainController(mainController); // now the service can invoke controller events
		rootScope.websocketService = _websocketService; // now the controller can invoke service methods

		// tell the controllers that the communication is up
		mainController.broadcastEvent('APPLICATION_INITIALIZED', null);
	});

	logInfo("Application finished initializing");
}
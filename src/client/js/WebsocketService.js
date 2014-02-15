function WebsocketService(){
	self = this;
	self.channelName = null;
	self.webSocket = null;
	var _mainController = null;

	self.setMainController = function(mainController){
		_mainController = mainController;
	}

	self.connect = function(connectionUrl){
		logDebug("Connecting to: {0} ({1})".format(connectionUrl, channelName));
		self.channelName = channelName;
		self.webSocket = io.connect(connectionUrl);
		self.webSocket.on("JOIN", function(data){
			logDebug("Recived data from server: {0}".format(data));
			//TODO: tell anders about eventName, dto structure
			eventReceived(data.eventName, data.dto);
		})
		.on()
		logDebug("Connected to: {0} ({1})".format(connectionUrl, channelName));
	}

	// generic event received from server, lets find a handler
	var eventReceived = function(eventName, dto){
		logDebug("CLIENT EVENT: {0}".format(eventName));
		eventHandler = this[eventName];
		if( eventHandler != null )
			eventHandler.call(this, dto);
		else
			logError("Does not know event name: '{0}'".format(eventName));
	}

	//---------- events handlers (invoked from server) ----------
	// this should be a list of all supported events
	this.GAMEUPDATE = function(gameState){
		// maybe chech that gameState is sane?
		if(mainController != null)
			mainController.broadcastEvent('GAMEUPDATE', eventArg);
	};

	//---------- events (invoked on server) -----------
	// this should be a list of all supported server events
	this.send = function(data){ // demo only, should be replaced
		logDebug("Sending data to server: {0}".format(data));
		self.webSocket.emit(self.channelName, data);
	}
}
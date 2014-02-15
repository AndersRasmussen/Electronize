var timeSent = 0, timeReceived = 0;
var rect=null,rect0=null,x=150,y=150,x0=150,y0=150;

var WsClient = function(){
	var self = this;
	self.webSocket = null;
	self.channelName = null;

	self.connect = function(channelName, connectionUrl){
		console.log("Connecting to: " + connectionUrl + " (" + channelName + ")");
		self.channelName = channelName;
		self.webSocket = io.connect(connectionUrl);
		self.webSocket.on(channelName, function(event){
			console.log("EVENT channel recieved data!");
			timeReceived = new Date().getTime() / 1000.0;
			$("span.testDelta").html(""+timeReceived-timeSent);
			switch(event)
			{
				case "up":
					y-=5;
					break;
				case "left":
				 	x-=5;
				 	break;
				case "right":
				 	x+=5;
				 	break;
				case "down":
				 	y+=5;
					break;
				default:
					console.log("unknown data received");
			}
			rect.attr({"x": x, "y": y});
		});
		console.log("Connected to web socket: " + connectionUrl + " channel: " + channelName);
	};

	self.send = function(data){
		self.webSocket.emit(this.channelName, data)
	}
};

var wsClient = new WsClient();
// load config from server
$.getJSON("/config.json", function(config){
	wsClient.connect('EVENT', config.wsUrl+":"+config.wsPort+"/event") //# connect to "EVENT" channel
});

// setup button
$(function(){
	$("div.button").fastClick(function(event){
		timeSent = new Date().getTime() / 1000.0;
		var direction = event.target.attributes["data-direction"].value;
		wsClient.send(direction);
		switch(direction)
		{
			case "up":
				y0-=5;
				break;
			case "left":
			 	x0-=5;
			 	break;
			case "right":
			 	x0+=5;
			 	break;
			case "down":
			 	y0+=5;
				break;
			default:
				console.log("unknown data received");
		}
		rect0.attr({"x": x0, "y": y0});
	});

	var paper = Raphael("canvas", 320, 320);
	rect0 = paper.rect(x, y, 20, 20, 4);
	rect0.attr({"fill": "#FFF", "stroke": "#FFF", "stroke-width": "1px"});
	rect = paper.rect(x, y, 20, 20, 4);
	rect.attr({"fill": "#09F", "stroke": "#000", "stroke-width": "1px"});
});
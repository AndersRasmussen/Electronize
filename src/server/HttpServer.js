var http = require('http')
var util = require('util')
var url = require('url')
var config = require('./config')
var nodeStatic = require('node-static')

var HttpServer = function(){
	var self = this;
	self.settings = { 
		wsPort: config.websocketServerPort,
		wsUrl: config.websocketServerUrl
	}
	self.httpServer = null;

	var init = function(){
		self.httpServer = createServer();
		self.httpServer.listen(self.settings.wsPort);
		logInfo('Http server started listening on PORT ' + self.settings.wsPort);
	};

	var createServer = function(){
		var server = http.createServer( function(request, response){
			var file = new nodeStatic.Server('build/client', {cache: false});
			request.addListener('data', function(){
				return self;
			});
			request.addListener('end', function(){
				var location = url.parse(request.url, true);
				var params = location.query || request.headers;

				if( location.pathname == '/config.json' && request.method == "GET" ){
					// -------- DYNAMIC RESPONSE (json config file)------
					response.writeHead(200, {'Content-Type': 'application/x-javascript'});
					var host = request.headers.host.split(':');
					var jsonString = JSON.stringify({
						wsPort: host[1],
						wsUrl: 'http://'+host[0]
					})
					response.write(jsonString);
					response.end();
				}
				else if(location.pathname == '/stat' && request.method == 'GET'){
					// --------- DYNAMIC RESPONSE report new visitor to all listening clients ------ 
					response.writeHead(200, {'Content-Type': 'text/plain'});
					response.write("ok");
					response.end();
				}
				else{
					// ----- Static files -----
					file.serve(request, response)
				}
			});
		});
		return server;
	};

	init();

	return self.httpServer;
}

module.exports = HttpServer;
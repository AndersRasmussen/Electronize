// the configuration is used like this
//		var config = require('./config')
//		config.websocketServerPort
module.exports = {
	"maxPlayer": 100,
	"websocketServerUrl":"http://127.0.0.1",
	"websocketServerPort":"8002",
	"gameloopInterval": 100,
	"boardUpdateInterval": 200,
	"maxSpeed":100,
	"boardHeight": 1000,
	"boardWidth": 1400,
	"playerHeight": 100,
	"playerWidth": 100,
	playerSight: {
		width: Math.PI/2,
		radius: 100
	},
	"playerSpritesCount": 7,
	scores: {
		kill: 1000,
		loving: 2000
	},
	timing: {
		loving: 5000,
		killed: 5000
	}
};
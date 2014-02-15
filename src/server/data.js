data = {
	boardstate: {
		height: 1000,
		width: 1400,
		players: []
	},
	player: {
		nick: "Jonas",
		id: "<socket id>",
		points: 199,
		x: 17.234,
		y: 67.129,
		rotation: 2.324, // orientation {0, 2pi}
		speed: 2.04, // velocity [grid/sec]
		killed: false, // first update since kill?
		mate: false,  // first update since mate?
		spriteType: 1
	},
	playerGfx: {
		player: player,
		newPlayer: player,
		gfx: gameGfx,
		updated: false // has the player been updated in this trip
	},
	gameGfx: {
		gfx: raphaelGfx,
		scale: 1.0
	}
}
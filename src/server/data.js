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
		r: 2.324, // orientation {0, 2pi}
		v: 2.04, // velocity [grid/sec]
		kill: false, // first update since kill?
		mate: false  // first update since mate?
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
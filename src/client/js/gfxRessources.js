gfxRessources = {
	createPlayerGfx: function(rsr) {
		return rsr.image("/img/rod-mand.png", 100, 100, 165, 82);
	},
	createBackgroundTile: function(tile) {
		return tile.image("/img/grass.png", 0, 0, 178, 178);
	},
	createHeart: function(tile) {
		return tile.image("/img/heart.png", 0, 0, 124, 109);
	}
};
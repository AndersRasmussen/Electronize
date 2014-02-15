gfxRessources = {
	createPlayerGfx: function(rsr) {
		return rsr.image("/img/rod-mand.png", 0, 0, 20, 10);
	},
	createRandomPlayerGfx: function(paper) {
		var images = ["/img/rod-mand.png","/img/blu-mand.png","/img/blo-mand.png"];
		
		var image = images[Math.floor(Math.random() * images.length)];
		
		return paper.image(image, 0, 0, 20, 10);
	},
	
	createBackgroundTile: function(tile) {
		return tile.image("/img/grass.png", 0, 0, 178, 178);
	},
	createHeart: function(tile) {
		return tile.image("/img/heart.png", 0, 0, 124, 109);
	}
};

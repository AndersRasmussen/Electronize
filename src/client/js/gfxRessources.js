gfxRessources = {
	createPlayerGfx: function(rsr) {
		return rsr.image("/img/rod-mand.png", 0, 0, 20, 10);
	},
	createPlayerGfx: function(paper, type) {

		var images = [
			"/img/rod-mand.png",
			"/img/blu-mand.png",
			"/img/blo-mand.png",
			"/img/redblonde.png",
			"/img/brownred.png",
			"/img/lightbluebrown.png",
			"/img/greybrown.png"];
		
		var image = images[type%images.length];
		
		return paper.image(image, 0, 0, 20, 10);
	},
	
	createBackgroundTile: function(tile) {
		return tile.image("/img/grass.png", 0, 0, 178, 178);
	},
	createHeart: function(tile) {
		return tile.image("/img/heart.png", 0, 0, 124, 109);
	},
	animateHeart: function (numAnimations, paper, x, y, image) {
		var it = this;
			
		if( image == null )
		{
			var iW = 124 /3;
			var iH = 108 /3;
			image = paper.image("img/heart.png", x - iW / 2, y - iH / 2, iW , iH);
			image.toFront();
		}

		image.animate({
			opacity: 0.3,
			transform: "s2.4"
		}, 300, "cubic-bezier(.26,1,.54,.56) ", function() {

			image.animate({
				opacity: 1,
				transform: "s1"
			}, 1000, "cubic-bezier(.26,1,.54,.56) ", function(){
				if(numAnimations>1)
					it.animateHeart(--numAnimations, paper, x, y, image);
				else
				{
					image.remove();
					image = null;
				}
			});
		});
	},
	animateDeath: function (numAnimations, paper, x, y, image) {
		var it = this;
		if( image == null ){
			var iW = 124 /3;
			var iH = 108 /3;
			image = paper.image("img/skull.png", x - iW / 2, y - iH / 2, iW , iH);
			image.toFront();
		}

		image.animate({
			opacity: 0.3,
			transform: "s2.4"
		}, 300, "cubic-bezier(.26,1,.54,.56) ", function() {

			image.animate({
				opacity: 1,
				transform: "s1"
			}, 1000, "cubic-bezier(.26,1,.54,.56) ", function(){
				if(numAnimations>1)
					it.animateDeath(--numAnimations, paper, x, y, image);
				else
				{
					image.remove();
					image = null;
				}
			});
		});
	}
};

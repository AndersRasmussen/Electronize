var NintendoController = function($$websocketService, $$soundManager) {
	var it = this;
	var connection;
	var $kill;
	var $love;
	var pushedVelocity;
	var oldPushedVelocity;

	it.init = function() {
		$$soundManager.initGameSounds();
		it.decorateControls();
		it.oldPushedVelocity = {};
		it.oldPushedVelocity.rotation = 0;
		it.oldPushedVelocity.speed = 0;
		it.updateMove();


	},
	it.decorateControls = function() {
		it.$kill = $('#kill');
		it.$love = $('#love');

		$('#navigation .pad .pad-button').fastClick(function(e) {
			var direction = e.target.attributes["data-direction"].value;
			var velocity = {};
			velocity.speed = 1;
			switch(direction) {
				case "n":
					velocity.rotation = Math.PI / 2;
				break;
				case "ne":
					velocity.rotation = Math.PI / 4;
				break;
				case "e":
					velocity.rotation = 0;
				break;
				case "se":
					velocity.rotation = -(Math.PI / 4); 
				break;
				case "s":
					velocity.rotation = -(Math.PI / 2);
				break;
				case "sw":
					velocity.rotation = -(3 * Math.PI / 4);
				break;
				case "w":
					velocity.rotation = Math.PI;
				break;
				case "nw":
					velocity.rotation = 3 * Math.PI / 4;
				break;
				case "c":
					velocity.speed = 0;
					velocity.rotation = it.oldPushedVelocity.rotation;
				break;
				default:
				throw "Direction to supported.";	
			}

			it.move(velocity);
		});

		it.$kill.fastClick(function() {
			it.kill();		
			$$soundManager.laserbeam();
		});

		it.$love.fastClick(function() {
			it.love();
		});
	},
	it.kill = function() {
		$$websocketService.kill();
	},
	it.love = function() {
		$$websocketService.love();
	},
	it.move = function(velocity) {
		it.pushedVelocity = velocity;
	},
	it.updateMove = function() {
		window.setInterval(function() {
			if(typeof it.pushedVelocity === 'undefined') {
				return false;
			}
			if(typeof it.oldPushedVelocity === 'undefined') {
				it.oldPushedVelocity = it.pushedVelocity;
			}
			else if(it.oldPushedVelocity.speed === it.pushedVelocity.speed && it.oldPushedVelocity.rotation === it.pushedVelocity.rotation) {
				return false;
			} else {
				it.oldPushedVelocity = it.pushedVelocity;
				$$websocketService.move(it.oldPushedVelocity);
				console.log("Speed: " + it.oldPushedVelocity.speed + ", rotation: " + it.oldPushedVelocity.rotation);
			}
		}, 100);
	}

	it.init();
}
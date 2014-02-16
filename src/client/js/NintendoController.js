var NintendoController = function($$websocketService, $$soundManager) {
	var it = this;
	var connection;
	var $kill;
	var $killCD;
	var $love;
	var $loveCD;
	var oldPushedVelocity;
	var oldTarget;

	it.init = function() {
		$$soundManager.initGameSounds();
		it.decorateControls();
		it.oldPushedVelocity = {};
		it.oldPushedVelocity.rotation = 0;
		it.oldPushedVelocity.speed = 0;


	},
	it.decorateControls = function() {
		it.$kill = $('#kill');
		it.$killCD = $('#kill_cd');
		
		it.$love = $('#love');
		it.$loveCD = $('#love_cd');		

		$('#navigation .pad .pad-button').fastClick(function(e) {
			var direction = e.target.attributes["data-direction"].value;

			if(typeof it.oldTarget !== 'undefined') {
				$(it.oldTarget).removeClass('active');
			}
			$(this).addClass('active');

			it.oldTarget = this;

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
			$$soundManager.buttonClick();
		});

		it.$kill.fastClick(function() {
			it.kill();		
			$$soundManager.laserbeam();
			it.$killCD.show();
			window.setTimeout(function() {
				it.$killCD.hide();
			},3000);
		});

		it.$love.fastClick(function() {
			it.love();
			$$soundManager.lovestruck();
			it.$loveCD.show();
			window.setTimeout(function() {
				it.$loveCD.hide();
			},3000);
		});
	},
	it.kill = function() {
		$$websocketService.kill();
	},
	it.love = function() {
		$$websocketService.love();
	},
	it.move = function(velocity) {
		$$websocketService.move(velocity);
		it.oldPushedVelocity = velocity;
	}

	it.init();
}
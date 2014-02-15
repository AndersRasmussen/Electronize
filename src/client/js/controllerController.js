var ControllerController = function($$websocketService) {
	var it = this;
	var connection;
	var $stick;
	var $bigRedStick;
	var pushedVelocity;
	var oldPushedVelocity;
	it.init = function() {
		it.$stick = $('#navigation .stick');
		it.$bigRedStick = $('#big-red-stick');
		it.decorateControls();
		it.adjustNavigationRatio();
		it.updateMove();
		$$websocketService.join();
	},
	it.decorateControls = function() {
		it.$stick.mousemove(function(e) {
			if(e.which == 1) {
				it.move(e);
			}
		});
	},

	// Speed is between 0 and 1.
	// Rotation is radians
	it.move = function(e) {
			var velocity = {};
			var x = e.pageX - it.$stick.position().left;
			var y = e.pageY - it.$stick.position().top; 

			var center = it.findStickCenter();

			var vector = {};
			vector.x = center.x - x;
			vector.y = center.y - y;

			var divisor = center.x > center.y ? center.x : center.y;
			velocity.speed = Math.sqrt(vector.x * vector.x, vector.y * vector.y) / divisor;
			velocity.rotation = Math.atan2(vector.x, vector.y);
			it.adjustBigRedStick(x, y);
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
			else if(it.oldPushedVelocity === it.pushedVelocity)
				return false;
			else {
				it.oldPushedVelocity = it.pushedVelocity;
				$$websocketService.move(it.oldPushedVelocity);
			}
		}, 100);
	},
	it.findStickCenter = function() {
		return {
			"x": it.$stick.width() / 2, 
			"y": it.$stick.height() / 2 
		};
	},
	it.adjustNavigationRatio = function() {
		if(it.$stick.height() > it.$stick.width()) {
			it.$stick.height(it.$stick.width());
		}
		else if (it.$stick.height() < it.$stick.width()) {
			it.$stick.width(it.$stick.height());
		}
	},
	it.adjustBigRedStick = function(x,y) {
		it.$bigRedStick.offset({left: x - (it.$bigRedStick.width() / 2), top: y - (it.$bigRedStick.height() / 2)});
	}

	it.init();
};
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
	},
	it.decorateControls = function() {
		it.$stick.mousemove(function(e) {
			if(e.which == 1) {
				it.move(e);
			}
		});

		it.$stick.bind('touchmove touchstart', function(e) {
			e.preventDefault();
			e.pageX = e.originalEvent.touches[0].pageX;
			e.pageY = e.originalEvent.touches[0].pageY;
		    it.move(e);
		});
	},

	// Speed is between 0 and 1.
	// Rotation is radians
	it.move = function(e) {
			var velocity = {};

			var x = e.pageX - it.$stick.position().left;
			var y = e.pageY - it.$stick.position().top; 
			
			it.adjustBigRedStick(x, y);

			var center = it.findStickCenter();

			var vector = {};
			vector.x = x - center.x;
			vector.y = -(y - center.y);
			$('.testDelta').text("("+vector.x+","+vector.y+")");
			var divisor = center.x > center.y ? center.x : center.y;
			velocity.speed = Math.sqrt(vector.x * vector.x, vector.y * vector.y) / divisor;
			velocity.rotation = Math.atan2(vector.x, vector.y);
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
			else if(it.oldPushedVelocity.speed === it.pushedVelocity.speed && it.oldPushedVelocity.rotation === it.pushedVelocity.rotation)
				return false;
			else {
				it.oldPushedVelocity = it.pushedVelocity;
				$$websocketService.move(it.oldPushedVelocity);
				console.log("Speed: " + it.oldPushedVelocity.speed + ", rotation: " + it.oldPushedVelocity.rotation);
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
		var halfStickSize = it.$bigRedStick.height() / 2;
		var offsetX, offsetY;
		if(x > (it.$stick.width() - halfStickSize) || x < (0 + halfStickSize)) {
			offsetX = x < 0 + halfStickSize ? 0 + halfStickSize : it.$stick.width() - halfStickSize;
		} else {
			offsetX = x;
		}
		if(y > (it.$stick.height() - halfStickSize) || y < (0 + halfStickSize)) {
			offsetY = y < 0 + halfStickSize ? 0 + halfStickSize : it.$stick.height() - halfStickSize;
		} else {
			offsetY = y;
		}
			it.$bigRedStick.offset({left: offsetX - (it.$bigRedStick.width() / 2), top: offsetY - (it.$bigRedStick.height() / 2)});
	}

	it.init();
};
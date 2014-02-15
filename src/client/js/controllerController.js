var ControllerController = function($$websocketService) {
	var it = this;
	var connection;
	var $stick;
	var $kill;
	var $love;
	var $bigRedStick;
	var pushedVelocity;
	var oldPushedVelocity;
	it.init = function() {
		$(document).ready(function() {
			it.$stick = $('#navigation .stick');
			it.$bigRedStick = $('#big-red-stick');
			it.$kill = $('#kill');
			it.$love = $('#love');
			
			it.decorateControls();
			it.adjustNavigationRatio();
			it.updateMove();
		});
		
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

		$(document).bind('touchup mouseup', function() {
			it.resetToCenter();
		});

		it.$kill.click(function() {
			it.kill();
		});

		it.$love.click(function() {
			it.love();
		})
	},
	it.kill = function() {
		$$websocketService.kill();
	},
	it.love = function() {
		$$websocketService.love();
	}

	// Speed is between 0 and 1.
	// Rotation is radians
	it.move = function(e) {
			var velocity = {};

			var x = e.pageX;
			var y = e.pageY; 
			
			it.adjustBigRedStick(x, y);

			var center = it.findStickCenter();

			var vector = {};
			vector.x = x - center.x;
			vector.y = -(y - center.y);
			$('.testDelta').text("("+vector.x+","+vector.y+")");
			var divisor = center.x > center.y ? center.x : center.y;
			velocity.speed = Math.min(Math.sqrt(vector.x * vector.x + vector.y * vector.y) / divisor, 1);
			velocity.rotation = Math.atan2(vector.y, vector.x);
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
			"x": (it.$stick.width() / 2) + it.$stick.offset().left, 
			"y": (it.$stick.height() / 2) + it.$stick.offset().top
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
		var halfStickSize = it.$bigRedStick.height() / 2.5;
		var quaterStickSize = halfStickSize / 2;
		var offsetX, offsetY;
		if(x < it.$stick.offset().left)
			x = it.$stick.offset().left;
		if(x > it.$stick.offset().left + it.$stick.width())
			x = it.$stick.offset().left + it.$stick.width()
		if(y < it.$stick.offset().top)
			y = it.$stick.offset().top;
		if(y > it.$stick.offset().top + it.$stick.height())
			y = it.$stick.offset().top + it.$stick.height();

		it.$bigRedStick.offset({left: x - (it.$bigRedStick.width() / 2), top: y - (it.$bigRedStick.height() / 2)});
	},

	it.resetToCenter = function() {
		var brsWidth = it.$bigRedStick.width() / 2;
		var brsHeight = it.$bigRedStick.height() / 2;
		it.$bigRedStick.offset({left: it.$stick.offset().left + it.$stick.width() / 2 - brsWidth, top: it.$stick.offset().top + it.$stick.height() / 2 - brsHeight});
	}

	it.init();
};
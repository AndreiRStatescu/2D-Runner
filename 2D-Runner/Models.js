var MathUtils = {
	norm: function(val, min, max) {
		return (val - min) / (max - min);
	},

	lerp: function(norm, min, max) {
		return norm * (max - min) + min;
	},

	map: function(val, srcMin, srcMax, destMin, destMax) {
		return lerp(norm(val, srcMin, srcMax), destMin, destMax);
	},

	clamp: function(val, min, max) {
		return Math.min(Math.max(val, min), max);
	},

	inRange: function(val, min, max) {
		return min <= val && val <= max;
	},

	distance: function(p0, p1) {
		var dx = p1.x - p0.x,
			dy = p1.y - p0.y;
		return Math.sqrt(dx * dx + dy * dy);
	},

	distanceXY: function(x1, y1, x2, y2) {
		var dx = x2 - x1,
			dy = y2 - y1;
		return Math.sqrt(dx * dx + dy * dy);
	},

	circleCollision: function(c0, c1) {
		return utils.distance(c0, c1) <= c0.radius + c1.radius;
	},

	circlePointCollision: function(x, y, circle) {
		return utils.distanceXY(x, y, circle.x, circle.y) <= circle.radius;
	},

	pointInRect: function (x, y, rect) {
		return utils.inRange(x, rect.x, rect.x+rect.width) && 
			utils.inRange(y, rect.y, rect.y+rect.height);
	},

	randomRange: function(min, max) {
		return Math.random() * (max - min) + min;
	}

}
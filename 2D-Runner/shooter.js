var shooter = {

	part: null,
	radius: 0,
	color: null,
	followingTargetX: false,
	followingTargetY: false,
	targetX: 0,
	targetY: 0,
	lastShotFrame: 0,

	create: function(x, y, radius, color) {
		var obj = Object.create(this);
		obj.part = particle.create(x, y, 0, 0);
		obj.radius = radius;
		obj.color = color;
		return obj;
	}
};
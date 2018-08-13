var particle = {

	pos: null,
	velocity: null,
	gravity: null,
	friction: null,

	create: function(x, y, speed, direction, gravity) {
		var obj = Object.create(this);
		obj.pos = vector.create(x, y);
		obj.velocity = vector.create(0, 0);
		obj.velocity.setLength(speed);
		obj.velocity.setAngle(direction);
		obj.gravity = vector.create(0, gravity || 0);
		obj.friction = vector.create(0, 0);
		return obj;
	},

	update: function() {
		if (this.velocity.x < -this.friction.x)
			this.velocity.x += this.friction.x;
		else if (this.velocity.x > this.friction.x)
			this.velocity.x -= this.friction.x;
		else
			this.velocity.x = 0;

		if (this.velocity.y < -this.friction.y)
			this.velocity.y += this.friction.y;
		else if (this.velocity.y > this.friction.y)
			this.velocity.y -= this.friction.y;
		else
			this.velocity.y = 0;

		this.velocity.addTo(this.gravity);
		this.pos.addTo(this.velocity);
	},

	accelerate: function(acceleration) {
		this.velocity.addTo(acceleration);
	},

	afterUpdatePos: function() {
		var fakeVeclocity = vector.create(this.velocity.x, this.velocity.y),
			fakePos = vector.create(this.pos.x, this.pos.y);

		if (fakeVeclocity.x < -this.friction.x)
			fakeVeclocity.x += this.friction.x;
		else if (fakeVeclocity.x > this.friction.x)
			fakeVeclocity.x -= this.friction.x;
		else
			fakeVeclocity.x = 0;

		if (fakeVeclocity.y < -this.friction.y)
			fakeVeclocity.y += this.friction.y;
		else if (fakeVeclocity.y > this.friction.y)
			fakeVeclocity.y -= this.friction.y;
		else
			fakeVeclocity.y = 0;

		fakeVeclocity.addTo(this.gravity);
		fakePos.addTo(fakeVeclocity);
		return fakePos;
	}
};
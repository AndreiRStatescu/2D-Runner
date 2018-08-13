var vector = {

	x: 1,
	y: 0,

	create: function(x, y) {
		var obj = Object.create(this);
		obj.x = x;
		obj.y = y;
		return obj;
	},

	setAngle: function(angle) {
		var length = this.getLength();
		this.x = length * Math.cos(angle);
		this.y = length * Math.sin(angle);
	},

	getAngle: function() {
		return Math.atan2(this.y, this.x);
	},

	setLength: function(length) {
		var angle = this.getAngle();
		this.x = length * Math.cos(angle);
		this.y = length * Math.sin(angle);
	},

	getLength: function() {
		return Math.sqrt(this.x * this.x + this.y * this.y);
	},

	add: function(v2) {
		return vector.create(this.x + v2.x, this.y + v2.y);
	},

	sub: function(v2) {
		return vector.create(this.x - v2.x, this.y - v2.y);
	},

	mul: function(val) {
		return vector.create(this.x * val, this.y * val);
	},

	div: function(val) {
		return vector.create(this.x / val, this.y / val);
	},

	addTo: function(v2) {
		this.x = this.x + v2.x;
		this.y = this.y + v2.y;
	},

	subTo: function(v2) {
		this.x = this.x - v2.x;
		this.y = this.y - v2.y;
	},

	mulTo: function(val) {
		this.x = this.x * val;
		this.y = this.y * val;
	},

	divTo: function(val) {
		this.x = this.x / val;
		this.y = this.y / val;
	}
};
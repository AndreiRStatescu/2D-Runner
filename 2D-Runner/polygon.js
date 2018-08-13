var polygon = {

	part: null,   // position of the poly, relative to the screen 
	model: null, // array of coordinates of the poly, relative to the position of the poly; these coordinates are positive only
	color: null, // color of the poly fill
	height: 0,
	width: 0,

	create: function(pos, model, color, width, height) {
		var obj = Object.create(polygon);
		obj.part = particle.create(pos.x, pos.y, 0, 0, V.GRAVITY);
		obj.model = model;		
		obj.color = color || "#000";
		obj.width = width;
		obj.height = height;
		return obj;
	},

	hasPolyInside: function(poly) {
		for (var i = 0; i < poly.model.length; i++) {
			var pos = poly.model[i].add(poly.part.pos);

			for (var j = 0; j < this.model.length-2; j++) {
				var pos1 = this.model[j].add(this.part.pos),
					pos2 = this.model[j+1].add(this.part.pos),
					pos3 = this.model[j+2].add(this.part.pos);

				if (!MathUtils.insideTriangle(pos, pos1, pos2, pos3))
					return false;
			}
		}
		return true;
	},

	hasPointInside: function(pos) {
		for (var j = 0; j < this.model.length-2; j++) {
			var pos1 = this.model[j].add(this.part.pos),
				pos2 = this.model[j+1].add(this.part.pos),
				pos3 = this.model[j+2].add(this.part.pos);

			if (!MathUtils.insideTriangle(pos, pos1, pos2, pos3))
				return false;
		}
		return true;
	}
};
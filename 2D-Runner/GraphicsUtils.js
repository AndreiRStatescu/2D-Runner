var GraphicsUtils = {

	drawDisk: function(context, x, y, radius, color) {
		context.fillStyle = color; 
		context.beginPath();
		context.arc(x, y, radius, 0, Math.PI*2, false);
		context.fill();
	},

	drawTarget: function(context, x, y, radius, color) {
		context.strokeStyle = color; 
		context.beginPath();
		context.arc(x, y, radius, 0, Math.PI*2, false);
		context.moveTo(x-radius, y);
		context.lineTo(x+radius, y);
		context.moveTo(x, y-radius);
		context.lineTo(x, y+radius);
		context.stroke();
	},

	drawPoly: function(context, polygon, color) {
		if (color != null) 
			context.fillStyle = color;
		else
			context.fillStyle = polygon.color;
		context.beginPath();
		context.moveTo(polygon.part.pos.x + polygon.model[polygon.model.length-1].x, 
					   polygon.part.pos.y + polygon.model[polygon.model.length-1].y);
		for (var i = 0; i < polygon.model.length; i++) {
			context.lineTo(polygon.part.pos.x + polygon.model[i].x, 
						   polygon.part.pos.y + polygon.model[i].y);
		}
		context.closePath();
		context.fill();
	}
}
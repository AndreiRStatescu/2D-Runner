var player = {

	poly: null,
	hiddenColor: null,

	jumping: false,
	movingLeft: false,
	movingRight: false,
	standing: false,
	visible: true,

	create: function(x, y, hiddenColor, width, height) {
		var obj = Object.create(this);
		obj.poly = V.getPlayerPoly(x, y, width, height);
		obj.hiddenColor = hiddenColor;
		return obj;
	}
};
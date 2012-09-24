L.Map.include({
	showLabel: function (label) {
		this._label = label;

		return this.addLayer(label);
	}
});
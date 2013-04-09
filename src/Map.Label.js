L.Map.include({
	showLabel: function (label) {
		if (label.options.watchOpacity && label._source instanceof L.Marker && label._source.options.opacity === 0) {return; }
		this._label = label;

		return this.addLayer(label);
	}
});
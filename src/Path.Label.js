L.Path.include({
	bindLabel: function (content, options) {
		if (!this._label || this._label.options !== options) {
			this._label = new L.Label(options, this);
		}

		this._label.setContent(content);

		if (!this._showLabelAdded) {
			this
				.on('mouseover', this._showLabel, this)
				.on('mousemove', this._moveLabel, this)
				.on('mouseout remove', this._hideLabel, this);

			if (L.Browser.touch) {
				this.on('click', this._showLabel, this);
			}
			this._showLabelAdded = true;
		}

		return this;
	},

	unbindLabel: function () {
		if (this._label) {
			this._hideLabel();
			this._label = null;
			this._showLabelAdded = false;
			this
				.off('mouseover', this._showLabel)
				.off('mousemove', this._moveLabel)
				.off('mouseout remove', this._hideLabel);
		}
		return this;
	},

	updateLabelContent: function (content) {
		if (this._label) {
			this._label.setContent(content);
		}
	},

	_showLabel: function (e) {
		this._label.setLatLng(e.latlng);
		this._map.showLabel(this._label);
	},

	_moveLabel: function (e) {
		this._label.setLatLng(e.latlng);
	},

	_hideLabel: function () {
		this._label.close();
	}
});
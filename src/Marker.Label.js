L.Marker.include({
	showLabel: function () {
		if (this._label && this._map) {
			this._label.setLatLng(this._latlng);
			this._map.showLabel(this._label);
		}

		return this;
	},

	hideLabel: function () {
		if (this._label) {
			this._label.close();
		}
		return this;
	},

	bindLabel: function (content, options) {
		var anchor = L.point(this.options.icon.options.labelAnchor) || new L.Point(0, 0);

		anchor = anchor.add(L.Label.prototype.options.offset);

		if (options && options.offset) {
			anchor = anchor.add(options.offset);
		}

		options = L.Util.extend({offset: anchor}, options);

		if (!this._label && !options.noHide) {
			this
				.on('mouseover', this.showLabel, this)
				.on('mouseout', this.hideLabel, this);

			if (L.Browser.touch) {
				this.on('click', this.showLabel, this);
			}
			this._haslabelHandlers = true;
		}

		this._label = new L.Label(options, this)
			.setContent(content);

		return this;
	},

	unbindLabel: function () {
		if (this._label) {
			this._label = null;

			if (this._haslabelHandlers) {
				this
					.off('mouseover', this.showLabel)
					.off('mouseout', this.hideLabel);

				if (L.Browser.touch) {
					this.of('click', this.showLabel);
				}
			}

			this._haslabelHandlers = false;
		}
		return this;
	},

	updateLabelContent: function (content) {
		if (this._label) {
			this._label.setContent(content);
		}
	}
});
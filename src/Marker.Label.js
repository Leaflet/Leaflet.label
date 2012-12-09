// Add in an option to icon that is used to set where the label anchor is
L.Icon.Default.mergeOptions({
	labelAnchor: new L.Point(9, -20)
});

// Have to do this since Leaflet is loaded before this plugin and initializes
// L.Marker.options.icon therefore missing our mixin above.
L.Marker.mergeOptions({
	icon: new L.Icon.Default()
});

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

		if (!this._label) {
			if (!options.noHide) {
				this
					.on('mouseover', this.showLabel, this)
					.on('mouseout', this.hideLabel, this);

				if (L.Browser.touch) {
					this.on('click', this.showLabel, this);
				}
			}

			this
				.on('remove', this.hideLabel, this)
				.on('move', this._moveLabel, this);

			this._haslabelHandlers = true;
		}

		this._label = new L.Label(options, this)
			.setContent(content);

		return this;
	},

	unbindLabel: function () {
		if (this._label) {
			this.hideLabel();

			this._label = null;

			if (this._haslabelHandlers) {
				this
					.off('mouseover', this.showLabel)
					.off('mouseout', this.hideLabel)
					.off('remove', this.hideLabel)
					.off('move', this._moveLabel);

				if (L.Browser.touch) {
					this.off('click', this.showLabel);
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
	},

	_moveLabel: function (e) {
		this._label.setLatLng(e.latlng);
	}
});
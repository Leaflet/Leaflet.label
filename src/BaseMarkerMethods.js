// This object is a mixin for L.Marker and L.CircleMarker. We declare it here as both need to include the contents.
L.BaseMarkerMethods = {
	showLabel: function () {
		if (this.label && this._map) {
			this.label._setLabelNoHide(true);
			this._removeLabelRevealHandlers();
			this._showLabel();
		}

		return this;
	},

	hideLabel: function () {
		if (this.label) {
			this.label.close();
		}
		if (this.label._setLabelNoHide(false)) {
			this._addLabelRevealHandlers();
		}
		return this;
	},

	setLabelNoHide: function (noHide) {
		if (noHide) {
			this.showLabel();
		} else {
			this.hideLabel();
		}
	},

	isLabelNoHide: function () {
		return this.label.options.noHide;
	},

	bindLabel: function (content, options) {
		var labelAnchor = this.options.icon ? this.options.icon.options.labelAnchor : this.options.labelAnchor,
			anchor = L.point(labelAnchor) || L.point(0, 0);

		anchor = anchor.add(L.Label.prototype.options.offset);

		if (options && options.offset) {
			anchor = anchor.add(options.offset);
		}

		options = L.Util.extend({offset: anchor}, options);

		if (!this.label || this.label.options !== options) {
			if (this.label) {
				this._hideLabel();
			}
			this.label = new L.Label(options, this);
		}
		this.label.setContent(content);

		if (!this._hasLabelHandlers) {
			if (!this.label.options.noHide) {
				this._addLabelRevealHandlers();
			}
			this
				.on('remove', this.hideLabel, this)
				.on('move', this._moveLabel, this)
				.on('add', this._onMarkerAdd, this);
			this._hasLabelHandlers = true;
		}

		return this;
	},

	unbindLabel: function () {
		if (this.label) {
			this.hideLabel();

			if (this._hasLabelHandlers) {
				if (!this.label.options.noHide) {
					this._removeLabelRevealHandlers();
				}

				this
					.off('remove', this.hideLabel, this)
					.off('move', this._moveLabel, this)
					.off('add', this._onMarkerAdd, this);
			}

			this._hasLabelHandlers = false;
			this.label = null;
		}
		return this;
	},

	updateLabelContent: function (content) {
		if (this.label) {
			this.label.setContent(content);
		}
	},

	getLabel: function () {
		return this.label;
	},

	_onMarkerAdd: function () {
		if (this.label.options.noHide) {
			this._showLabel();
		}
	},

	_addLabelRevealHandlers: function () {
		this
			.on('mouseover', this._showLabel, this)
			.on('mouseout', this.hideLabel, this);

		if (L.Browser.touch) {
			this.on('click', this._showLabel, this);
		}
	},

	_removeLabelRevealHandlers: function () {
		this
			.off('mouseover', this._showLabel, this)
			.off('mouseout', this.hideLabel, this);

		if (L.Browser.touch) {
			this.off('click', this._showLabel, this);
		}
	},

	_showLabel: function () {
		this.label.setLatLng(this._latlng);
		this._map.showLabel(this.label);
	},

	_moveLabel: function (e) {
		this.label.setLatLng(e.latlng);
	}
};

/*global LeafletLabel */

L.Path.include({
	showLabel: function () {
		if (this.label && this._map) {
			this.label.setLatLng(this.getBounds().getCenter());
			this._map.showLabel(this.label);
		}

		return this;
	},

	hideLabel: function () {
		if (this.label) {
			this.label.close();
		}
		return this;
	},

	bindLabel: function (content, options) {
		if (!this.label || this.label.options !== options) {
			this.label = new LeafletLabel(options, this);
		}

		this.label.setContent(content);

		this._labelNoHide = options && options.noHide;

		if (!this._showLabelAdded) {
			if(!this._labelNoHide) {
				this
					.on('mouseover', this._showLabel, this)
					.on('mousemove', this._moveLabel, this)
					.on('mouseout', this._hideLabel, this);

				if (L.Browser.touch) {
					this.on('click', this._showLabel, this);
				}
			}
			this.on('remove', this._hideLabel, this);
			this._showLabelAdded = true;
		}

		return this;
	},

	unbindLabel: function () {
		if (this.label) {
			this._hideLabel();
			this.label = null;
			this._showLabelAdded = false;
			if(!this._labelNoHide) {
				this
					.off('mouseover', this._showLabel, this)
					.off('mousemove', this._moveLabel, this)
					.off('mouseout', this._hideLabel, this);
			}
			this.on('remove', this._hideLabel, this);
		}
		return this;
	},

	updateLabelContent: function (content) {
		if (this.label) {
			this.label.setContent(content);
		}
	},

	_showLabel: function (e) {
		this.label.setLatLng(e.latlng);
		this._map.showLabel(this.label);
	},

	_moveLabel: function (e) {
		this.label.setLatLng(e.latlng);
	},

	_hideLabel: function () {
		this.label.close();
	}
});

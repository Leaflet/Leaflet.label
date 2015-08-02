L.Path.include({
	showLabel: function (latlng) {
		if (this.label && this._map) {
			if (!latlng) {
				if (typeof this.getCenter === "function") {
					latlng = this.getCenter();
				} else {
					return this;
				}
			}
			this.label.setLatLng(latlng);
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

	setLabelNoHide: function (noHide) {
		if (this.label.options.noHide === noHide) {
			return;
		}

		this.label.options.noHide = noHide;

		if (noHide) {
			this._removeLabelRevealHandlers();
			this.showLabel();
		} else {
			this._addLabelRevealHandlers();
			this.hideLabel();
		}
	},

	isLabelNoHide: function () {
		return this.label.options.noHide;
	},

	bindLabel: function (content, options) {
		if (!this.label || this.label.options !== options) {
			if (this.label) {
				this._hideLabel();
			}
			this.label = new L.Label(options, this);
		}

		this.label.setContent(content);

		if (!this._hasLabelHandlers) {
			if (this.label.options.noHide) {
				this.on('add', this._onPathAdd, this);
			} else {
				this._addLabelRevealHandlers();
			}
			this.on('remove', this._hideLabel, this);
			this._hasLabelHandlers = true;
		}

		return this;
	},

	unbindLabel: function () {
		if (this.label) {
			this._hideLabel();
			if (this._hasLabelHandlers) {
				if (this.label.options.noHide) {
					this.off('add', this._onPathAdd, this);
				} else {
					this._removeLabelRevealHandlers();
				}
				this.off('remove', this._hideLabel, this);
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

	_onPathAdd: function () {
		if (this.label.options.noHide) {
			this.showLabel();
		}
	},

	_addLabelRevealHandlers: function () {
		this
			.on('mouseover', this._showLabel, this)
			.on('mousemove', this._moveLabel, this)
			.on('mouseout', this._hideLabel, this);

		if (L.Browser.touch) {
			this.on('click', this._showLabel, this);
		}
	},

	_removeLabelRevealHandlers: function () {
		this
			.off('mouseover', this._showLabel, this)
			.off('mousemove', this._moveLabel, this)
			.off('mouseout', this._hideLabel, this);
		if (L.Browser.touch) {
			this.off('click', this._showLabel, this);
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

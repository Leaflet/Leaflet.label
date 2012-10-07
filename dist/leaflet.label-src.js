/*
 Copyright (c) 2012, Smartrak, Jacob Toye
 Leaflet.label is an open-source JavaScript library for adding labels to markers and paths on leaflet powered maps.
 https://github.com/jacobtoye/Leaflet.label
*/
(function (window, undefined) {

L.Label = L.Popup.extend({
	options: {
		autoPan: false,
		className: '',
		closePopupOnClick: false,
		noHide: false,
		offset: new L.Point(12, -15) // 6 (width of the label triangle) + 6 (padding)
	},

	onAdd: function (map) {
		this._map = map;

		if (!this._container) {
			this._initLayout();
		}
		this._updateContent();

		var animFade = map.options.fadeAnimation;

		if (animFade) {
			L.DomUtil.setOpacity(this._container, 0);
		}
		map._panes.popupPane.appendChild(this._container);

		map.on('viewreset', this._updatePosition, this);

		if (L.Browser.any3d) {
			map.on('zoomanim', this._zoomAnimation, this);
		}

		this._update();

		if (animFade) {
			L.DomUtil.setOpacity(this._container, 1);
		}
	},

	close: function () {
		var map = this._map;

		if (map) {
			map._label = null;

			map.removeLayer(this);
		}
	},

	_initLayout: function () {
		this._container = L.DomUtil.create('div', 'leaflet-label ' + this.options.className + ' leaflet-zoom-animated');
	},

	_updateContent: function () {
		if (!this._content) { return; }

		if (typeof this._content === 'string') {
			this._container.innerHTML = this._content;
		}
	},

	_updateLayout: function () {
		// Do nothing
	},

	_updatePosition: function () {
		var pos = this._map.latLngToLayerPoint(this._latlng);

		this._setPosition(pos);
	},

	_setPosition: function (pos) {
		pos = pos.add(this.options.offset);

		L.DomUtil.setPosition(this._container, pos);
	},

	_zoomAnimation: function (opt) {
		var pos = this._map._latLngToNewLayerPoint(this._latlng, opt.zoom, opt.center);

		this._setPosition(pos);
	}
});

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
	}
});

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
				.on('mouseout', this._hideLabel, this);

			if (L.Browser.touch) {
				this.on('click', this._showLabel, this);
			}
			this._showLabelAdded = true;
		}

		return this;
	},

	unbindLabel: function () {
		if (this._label) {
			this._label = null;
			this._showLabelAdded = false;
			this
				.off('mouseover', this._showLabel)
				.off('mousemove', this._moveLabel)
				.off('mouseout', this._hideLabel);
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

L.Map.include({
	showLabel: function (label) {
		this._label = label;

		return this.addLayer(label);
	}
});



}(this));